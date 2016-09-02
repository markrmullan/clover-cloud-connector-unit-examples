require("prototype");
var ExampleCloverConnectorListener = require("./ExampleCloverConnectorListener.js");
var clover = require("remote-pay-cloud");
var TestBase = require("./TestBase.js");

/* Start: Test a sale */
/**
 * A test of the sale functionality.
 *
 * @type {ExampleCloverConnectorListener}
 */
var SaleVoidExampleCloverConnectorListener = Class.create( ExampleCloverConnectorListener, {
    onReady: function ($super, merchantInfo) {
        $super(merchantInfo);
        /*
         The connector is ready, create a sale request and send it to the device.
         */
        var saleRequest = new clover.remotepay.SaleRequest();
        saleRequest.setExternalId(clover.CloverID.getNewId());
        saleRequest.setAmount(10000);
        this.displayMessage({message: "Sending sale", request: saleRequest});
        this.cloverConnector.sale(saleRequest);
    },
    onSaleResponse: function (response) {
        /*
         The sale is complete.  It might be canceled, or successful.  This can be determined by the
         values in the response.
         */
        this.displayMessage({message: "Sale response received", response: response});
        if (!response.getIsSale()) {
            this.displayMessage({error: "Response is not a sale!"});
        }
        var request = new clover.remotepay.VoidPaymentRequest();

        request.setOrderId(response.getPayment().getOrder().getId());
        request.setPaymentId(response.getPayment().getId());
        request.setVoidReason(clover.order.VoidReason.USER_CANCEL);

        // Note, this should fail!
        this.cloverConnector.voidPayment(request);
    },

    /**
     * Will be called after a void payment request and contains the voided paymentId
     * @memberof remotepay.ICloverConnectorListener
     *
     * @param {remotepay.VoidPaymentResponse} response
     * @return void
     */
    onVoidPaymentResponse: function(response) {
        this.displayMessage({message: "VoidPaymentResponse received", response: response});
        if(!response.getSuccess()) {
            this.displayMessage({message: "VoidPaymentResponse,  !!! something is wrong, this failed !!!"});
        }

        // Always call this when your test is done, or the device may fail to connect the
        // next time, because it is already connected.
        this.testComplete();
    },

    /**
     * Used in the test to help identify where messages come from.
     * @returns {string}
     */
    getTestName: function() {
        return "Test VoidPaymentResponse";
    }
});
/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
TestSaleVoid = Class.create( TestBase, {
    getCloverConnectorListener: function(cloverConnector) {
        return new SaleVoidExampleCloverConnectorListener(cloverConnector, progressinfoCallback);
    }
});

/**
 * Attach the test of a sale to the testbase to facilitate calling from the main page.
 * @param configUrl
 * @param progressinfoCallback
 */
TestBase.TestSaleVoid = function(configUrl, progressinfoCallback) {
    var testObj = new TestSaleVoid(configUrl, "test", progressinfoCallback);
    testObj.test();
};

if ('undefined' !== typeof module) {
    module.exports = TestSaleVoid;
}
