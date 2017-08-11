import Ember from 'ember';
import {
  task
} from 'ember-concurrency';

export default Ember.Route.extend({

  init() {
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
  },

  getFirst: task(function* () {
    let first = yield $.getJSON("/restful/first")

    return {
      first: first
    };
  }),

  getSecond: task(function* () {
    return {
        second: yield $.getJSON("/restful/first")
    }
  }),

  runMultipleTasks: task(function * () {
    return {
        firstTaskResults: yield this.get('getFirst').perform(),
        secondTaskResults: yield this.get('getSecond').perform()
    }
  }),

  model() {
      debugger;
    return this.get('runMultipleTasks').perform();
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
