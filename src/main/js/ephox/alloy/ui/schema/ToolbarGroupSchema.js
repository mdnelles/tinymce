define(
  'ephox.alloy.ui.schema.ToolbarGroupSchema',

  [
    'ephox.alloy.data.Fields',
    'ephox.alloy.parts.PartType',
    'ephox.boulder.api.FieldSchema',
    'ephox.katamari.api.Fun'
  ],

  function (Fields, PartType, FieldSchema, Fun) {
    var schema = [
      FieldSchema.strict('items'),
      Fields.markers([ 'itemClass' ]),
      FieldSchema.defaulted('hasTabstop', true),
      FieldSchema.defaulted('tgroupBehaviours', { })
    ];

    var partTypes = [
      PartType.group({
        name: 'items',
        unit: 'item',
        overrides: function (detail) {
          return {
            domModification: {
              classes: [ detail.markers().itemClass() ]
            }
          };
        }
      })
    ];

    return {
      name: Fun.constant('ToolbarGroup'),
      schema: Fun.constant(schema),
      parts: Fun.constant(partTypes)
    };
  }
);