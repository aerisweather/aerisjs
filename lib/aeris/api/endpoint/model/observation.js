define([
    'ai/util',
    'ai/api/endpoint/model/pointdata'
], function(_, PointData) {
    /**
     * @publicApi
     * @class Observation
     * @namespace aeris.api.model
     * @extends aeris.api.endpoint.model.PointData
     *
     * @constructor
     * @override
     */
    var Observation = function(opt_attrs, opt_options) {
        PointData.call(this, opt_attrs, opt_options);
    };
    _.inherits(Observation, PointData);

    /**
     * @method parse
     */
    Observation.prototype.parse = function(res) {
        var attrs = PointData.prototype.parse.apply(this, arguments);

        if (!res.report || !res.report.id) {
            throw new ApiResponseError('Missing id');
        }

        attrs.id = res.report.id;

        return attrs;
    };

    return _.expose(Observation, 'aeris.api.Observation');
});
