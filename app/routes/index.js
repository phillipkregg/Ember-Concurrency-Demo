import Ember from 'ember';
import {
  task
} from 'ember-concurrency';

export default Ember.Route.extend({

  getDataTask: task(function* () {
     /*************************************
     * Define the API with mock ajax calls
     ************************************/
    $.mockjax({
      url: "/restful/first",
      responseText: {
        status: "success",
        message: "Got dat data!"
      }
    });

    $.mockjax({
      url: "/restful/second",
      responseText: {
        status: "success",
        message: "Got more!"
      }
    });

    $.mockjax({
      url: "/restful/third",
      responseText: {
        status: "success",
        message: "Got third!"
      }
    });

    $.mockjax({
        url: "/restful/500-error",
        // Server 500 error occurred
        status: 500,
        responseText: "500 Internal Server Error"
    });

    /*
    The yield keyword, when used with a promise, 
    lets you pause execution of your task function 
    until that promise resolves, at which point the 
    task function will continue running from where it had paused.
    */

    let first = yield $.getJSON("/restful/first");
    let second = yield $.getJSON("/restful/second");
    let third = yield $.getJSON("/restful/third");
    let error500 = yield $.getJSON("/restful/500-error").then(
        (success) => {
            return success.responseText;
        },

        (failure) => {
            return failure.responseText;
        }
    );

    return {
      first: first,
      second: second,
      third: third,
      error500: error500
    };
  }),

  model() {

    /*************************************
     * The old way we would have to do
     * this with promises
     ************************************/
    // return $.getJSON("/restful/first").then((first) => {
    //     console.log(first.message);
    //     $.getJSON("/restful/second").then((second) => {
    //         console.log(second.message);
    //         $.getJSON("/restful/third").then((third) => {
    //             console.log(third.message);
    //         })

    //     })
    // })

    /*************************************
     * Call task to retrieve model data
     ************************************/
    return this.get('getDataTask').perform();
  },

  afterModel(model) {
    /*************************************
     * Inspect the model
     ************************************/
    console.log('Here is the model:');
    console.info(model);
  },

  setupController(controller, model) {
    this._super(controller, model);

    let formattedModel = JSON.stringify(model, null, 2);
    controller.set('stringModel', formattedModel);

  }


});
