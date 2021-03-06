var sdk = require("remote-pay-cloud-api");
var ExampleCloverConnectorListener = require("../ExampleCloverConnectorListener.js");
var clover = require("remote-pay-cloud");
var TestBase = require("../TestBase.js");

/* Start: Test a sale */
/**
 * A test of the sale functionality.
 *
 * @type {SaleExampleNegZeroAmountCloverConnectorListener}
 */
var SaleExampleNegZeroAmountCloverConnectorListener = function (cloverConnector, progressinfoCallback) {
    ExampleCloverConnectorListener.call(this, cloverConnector, progressinfoCallback);
    this.cloverConnector = cloverConnector;
    this.progressinfoCallback = progressinfoCallback;
};

SaleExampleNegZeroAmountCloverConnectorListener.prototype = Object.create(ExampleCloverConnectorListener.prototype);
SaleExampleNegZeroAmountCloverConnectorListener.prototype.constructor = SaleExampleNegZeroAmountCloverConnectorListener;

SaleExampleNegZeroAmountCloverConnectorListener.prototype.startTest = function () {
    ExampleCloverConnectorListener.prototype.startTest.call(this);
    /*
     The connector is ready, create a sale request and send it to the device.
     */
    var saleRequest = new sdk.remotepay.SaleRequest();
    saleRequest.setExternalId(clover.CloverID.getNewId());
    saleRequest.setAmount( 0 /*10000*/);
    this.displayMessage({message: "Sending sale", request: saleRequest});
    this.cloverConnector.sale(saleRequest);
};
SaleExampleNegZeroAmountCloverConnectorListener.prototype.onSaleResponse = function (response) {
    /*
     The sale is complete.  It might be canceled, or successful.  This can be determined by the
     values in the response.
     */
    this.displayMessage({message: "Sale response received", response: response});
    if (!response.getIsSale()) {
        this.displayMessage({error: "Response is not a sale!"});
        this.testComplete(!response.getSuccess());
        return;
    }
    // Always call this when your test is done, or the device may fail to connect the
    // next time, because it is already connected.
    this.testComplete(!response.getSuccess());
};

/**
 * Used in the test to help identify where messages come from.
 * @returns {string}
 */
SaleExampleNegZeroAmountCloverConnectorListener.prototype.getTestName = function () {
    return "Test Sale NegZeroAmount";
};

/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
TestSaleNegZeroAmount = function (configUrl, friendlyName, progressinfoCallback) {
    TestBase.call(this, configUrl, friendlyName, progressinfoCallback);
};

TestSaleNegZeroAmount.prototype = Object.create(TestBase.prototype);
TestSaleNegZeroAmount.prototype.constructor = TestSaleNegZeroAmount;

TestSaleNegZeroAmount.prototype.getCloverConnectorListener = function (cloverConnector) {
    return new SaleExampleNegZeroAmountCloverConnectorListener(cloverConnector, this.progressinfoCallback);
};

/**
 * Attach the test of a sale to the testbase to facilitate calling from the main page.
 * @param configUrl
 * @param progressinfoCallback
 */
TestBase.TestSaleNegZeroAmount = function(configUrl, configFile, progressinfoCallback) {
    var testObj = new TestSaleNegZeroAmount(configUrl, configFile, progressinfoCallback);
    testObj.test();
};

if ('undefined' !== typeof module) {
    module.exports = TestSaleNegZeroAmount;
}
