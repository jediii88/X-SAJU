const fs = require('fs');
const { execSync } = require('child_process');

try {
  execSync('zip X-SAJU_v8.zip X-SAJU_MASTER_v8.html report_engine_v8.js saju_database_v8.js lunar.js constants.js calculation_engine.js');
} catch(e) {
  // zip not installed, let's use tar
  execSync('tar -cvf X-SAJU_v8.tar X-SAJU_MASTER_v8.html report_engine_v8.js saju_database_v8.js lunar.js constants.js calculation_engine.js');
}
