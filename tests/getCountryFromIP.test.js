const { getCountryFromIP } = require("../middlewares/session");

describe("This set of tests gonna cover the functionality of getCountryFromIP", () => {
    it("should return united states for this US IP 72.229.28.185", async () => {
        const results = await getCountryFromIP('72.229.28.185')
        expect(results).toBe("United States")
    })
})