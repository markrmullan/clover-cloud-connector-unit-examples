var sdk = require("remote-pay-cloud-api");
var ExampleCloverConnectorListener = require("../ExampleCloverConnectorListener.js");
var clover = require("remote-pay-cloud");
var TestBase = require("../TestBase.js");

/* Start: Test a sale */
/**
 * A test of the sale functionality.
 *
 * @type {BadRejectExampleCloverConnectorListener}
 */
var BadRejectExampleCloverConnectorListener = function (cloverConnector, progressinfoCallback) {
    ExampleCloverConnectorListener.call(this, cloverConnector, progressinfoCallback);
    this.cloverConnector = cloverConnector;
    this.progressinfoCallback = progressinfoCallback;
};

BadRejectExampleCloverConnectorListener.prototype = Object.create(ExampleCloverConnectorListener.prototype);
BadRejectExampleCloverConnectorListener.prototype.constructor = BadRejectExampleCloverConnectorListener;

BadRejectExampleCloverConnectorListener.prototype.startTest = function () {
try{
    ExampleCloverConnectorListener.prototype.startTest.call(this);
    /*
     The connector is ready, create a sale request and send it to the device.
     */
    var saleRequest = new sdk.remotepay.SaleRequest();
    saleRequest.setExternalId(clover.CloverID.getNewId());
    saleRequest.setAmount(10);
    this.displayMessage({message: "Sending sale", request: saleRequest});
    this.cloverConnector.sale(saleRequest);
} catch (e) {
    console.log(e);
    this.testComplete(false);
}
};

BadRejectExampleCloverConnectorListener.prototype.onSaleResponse = function (response) {
try{
    /*
     The sale is complete.  It might be canceled, or successful.  This can be determined by the
     values in the response.
     */
    this.displayMessage({message: "Sale response received", response: response});
    if (!response.getIsSale()) {
        this.displayMessage({error: "Response is not a sale!  Trying to continue..."});
    }
    // Always call this when your test is done, or the device may fail to connect the
    // next time, because it is already connected.
    this.testComplete(!response.getSuccess());
} catch (e) {
    console.log(e);
    this.testComplete(false);
}
};

/**
 * Used in the test to help identify where messages come from.
 * @returns {string}
 */
BadRejectExampleCloverConnectorListener.prototype.getTestName = function () {
    return "Test Bad Reject, invalid payment id";
};

/**
 * Send an automatic verification for all challenges.  If this is not implemented
 * the device will stay on the "Merchant is verifying your payment" screen.
 * @param request
 */
BadRejectExampleCloverConnectorListener.prototype.onConfirmPaymentRequest = function(request) {
try{
    this.displayMessage({message: "Sending in bad payment to acceptPayment", request: request});
    var badPayment = new sdk.payments.Payment();
    badPayment.setId("1234567890123");
    this.cloverConnector.rejectPayment(badPayment, request.getChallenges()[0]);
} catch (e) {
    console.log(e);
    this.testComplete(false);
}
};

/**
 * Will be called when an error occurs when trying to send messages to the device
 * @memberof remotepay.ICloverConnectorListener
 *
 * @param {remotepay.CloverDeviceErrorEvent} deviceErrorEvent
 * @return void
 */
BadRejectExampleCloverConnectorListener.prototype.onDeviceError = function(deviceErrorEvent) {
    ExampleCloverConnectorListener.prototype.onDeviceError.call(this, deviceErrorEvent);
    setTimeout(function(){ this.testComplete(true);}.bind(this), 15000);
};


/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
TestBadReject = function (configUrl, friendlyName, progressinfoCallback) {
    TestBase.call(this, configUrl, friendlyName, progressinfoCallback);
};

TestBadReject.prototype = Object.create(TestBase.prototype);
TestBadReject.prototype.constructor = TestBadReject;

TestBadReject.prototype.getCloverConnectorListener = function (cloverConnector) {
    return new BadRejectExampleCloverConnectorListener(cloverConnector, this.progressinfoCallback);
};

/**
 * Attach the test of a sale to the testbase to facilitate calling from the main page.
 * @param configUrl
 * @param progressinfoCallback
 */
TestBase.TestBadReject = function(configUrl, configFile, progressinfoCallback) {
    var testObj = new TestBadReject(configUrl, configFile, progressinfoCallback);
    testObj.test();
};

if ('undefined' !== typeof module) {
    module.exports = TestBadReject;
}
