/**
 * SAJUX 링크 API 클라이언트 (정적 리포트·궁합·관리자 공용)
 */
(function (global) {
  'use strict';

  /** 생일 저장 서버 (Vercel). sajux.com 화면에서도 이 주소로 조회 */
  var SAJUX_LINK_API_BASE = 'https://x-saju-black.vercel.app';

  function metaApiBase() {
    try {
      var m = document.querySelector('meta[name="sajux-link-api"]');
      if (m && m.getAttribute('content')) return String(m.getAttribute('content')).trim();
    } catch (e) {}
    return '';
  }

  function getApiBase() {
    if (metaApiBase()) return metaApiBase();
    if (SAJUX_LINK_API_BASE) return SAJUX_LINK_API_BASE;
    try {
      if (typeof location !== 'undefined' && location.origin) return location.origin;
    } catch (e0) {}
    return '';
  }

  /** 고객용 code 링크인지 (생일이 URL에 없음) */
  function isCodeOnlyUrl(url) {
    try {
      var u = new URL(String(url || ''), location.origin);
      return !!(u.searchParams.get('code') && !u.searchParams.get('y'));
    } catch (e) {
      return false;
    }
  }

  function apiUrl(path) {
    var p = path.indexOf('/') === 0 ? path : '/' + path;
    if (p.indexOf('/api/') !== 0) p = '/api' + p;
    var base = getApiBase().replace(/\/+$/, '');
    if (!base) throw new Error('API_NOT_CONFIGURED');
    return base + p;
  }

  function linkErrorMessage(status, body) {
    if (status === 410) {
      if (body && body.error === 'revoked') return 'LINK_REVOKED';
      return 'LINK_EXPIRED';
    }
    if (status === 404) return 'LINK_NOT_FOUND';
    return 'LINK_API_' + status;
  }

  async function fetchByCode(code) {
    var c = String(code || '').trim();
    if (!c) throw new Error('LINK_CODE_EMPTY');
    var res = await fetch(apiUrl('/v1/links/' + encodeURIComponent(c)), {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    var body = null;
    try {
      body = await res.json();
    } catch (e) {}
    if (!res.ok) throw new Error(linkErrorMessage(res.status, body));
    return body;
  }

  async function issueLink(type, payload, expAt, adminPass) {
    var key = adminPass || '';
    try {
      if (!key) key = (sessionStorage.getItem('sajux_admin_sess') || '').trim();
    } catch (e2) {}
    if (!key) throw new Error('ADMIN_NOT_LOGGED_IN');
    var res = await fetch(apiUrl('/v1/links'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + key,
      },
      body: JSON.stringify({
        type: type === 'couple' ? 'couple' : 'single',
        payload: payload,
        expAt: expAt || 0,
      }),
    });
    var body = null;
    try {
      body = await res.json();
    } catch (e3) {}
    if (!res.ok) {
      var msg = (body && body.error) || res.status;
      throw new Error('API_ISSUE_' + msg);
    }
    return body;
  }

  async function revokeLink(code, adminPass) {
    var key = adminPass || '';
    try {
      if (!key) key = (sessionStorage.getItem('sajux_admin_sess') || '').trim();
    } catch (e4) {}
    if (!key) throw new Error('ADMIN_NOT_LOGGED_IN');
    var res = await fetch(apiUrl('/v1/links/' + encodeURIComponent(code) + '/revoke'), {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + key },
    });
    if (!res.ok) throw new Error('API_REVOKE_' + res.status);
    return res.json();
  }

  function parseGenderFromPayload(g) {
    var s = String(g || '').toLowerCase();
    if (s === 'w' || s === 'female' || s === 'f' || s === '여') return 'female';
    return 'male';
  }

  function singlePayloadToSajuxParams(pl) {
    pl = pl || {};
    var mo = String(pl.mo != null ? pl.mo : 1).padStart(2, '0');
    var dy = String(pl.d != null ? pl.d : 1).padStart(2, '0');
    var unk = !!pl.unknown;
    var hr = unk ? '12' : String(pl.h != null ? pl.h : 12).padStart(2, '0');
    var mn = unk ? '00' : String(pl.mi != null ? pl.mi : 0).padStart(2, '0');
    return {
      name: pl.name || '고객',
      gender: parseGenderFromPayload(pl.gender),
      cal: pl.cal === 'lunar' ? 'lunar' : 'solar',
      birthDate: String(pl.y) + mo + dy,
      birthTime: unk ? '1200' : hr + mn,
      yundal: !!pl.yundal,
      unknown: unk,
      reportBaseAt: pl.reportBaseAt || '',
      reportIssuedAt: pl.reportIssuedAt || '',
    };
  }

  function sideToCompatParams(side) {
    side = side || {};
    return {
      name: side.name || '',
      gender: parseGenderFromPayload(side.gender),
      cal: side.cal === 'lunar' ? 'lunar' : 'solar',
      year: parseInt(side.y, 10) || 1990,
      month: parseInt(side.mo, 10) || 1,
      day: parseInt(side.d, 10) || 1,
      hour: side.unknown ? 12 : parseInt(side.h, 10) || 12,
      unknown: !!side.unknown,
    };
  }

  function couplePayloadToParams(pl) {
    pl = pl || {};
    return {
      a: sideToCompatParams(pl.a),
      b: sideToCompatParams(pl.b),
      rel: pl.rel || 'lover',
      by: pl.by || '',
    };
  }

  function linkErrorToKorean(err) {
    var m = String((err && err.message) || err || '');
    if (m === 'LINK_EXPIRED') return '리포트 유효기간이 지났습니다. 담당자에게 다시 발급을 요청해 주세요.';
    if (m === 'LINK_REVOKED') return '이 링크는 사용이 중지되었습니다. 담당자에게 문의해 주세요.';
    if (m === 'LINK_NOT_FOUND') return '올바른 링크가 아닙니다. 담당자에게 다시 받은 주소로 열어 주세요.';
    if (m === 'API_NOT_CONFIGURED') return '링크 서버가 설정되지 않았습니다.';
    return '리포트를 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.';
  }

  global.SajuxLinkApi = {
    getApiBase: getApiBase,
    isCodeOnlyUrl: isCodeOnlyUrl,
    fetchByCode: fetchByCode,
    issueLink: issueLink,
    revokeLink: revokeLink,
    singlePayloadToSajuxParams: singlePayloadToSajuxParams,
    couplePayloadToParams: couplePayloadToParams,
    linkErrorToKorean: linkErrorToKorean,
  };
})(typeof window !== 'undefined' ? window : globalThis);
