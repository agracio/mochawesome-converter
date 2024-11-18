const common = require("./common");
const fs = require("fs");

const teardown = async () => {
    common.removeTempDir();
}
module.exports = teardown;