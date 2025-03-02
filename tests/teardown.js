const common = require("./common");

const teardown = async () => {
    common.removeTempDir();
}
module.exports = teardown;