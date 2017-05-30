asynctest(
  'RepresentingTest (mode: dataset)',

  [
    'ephox.agar.api.ApproxStructure',
    'ephox.agar.api.Assertions',
    'ephox.agar.api.FocusTools',
    'ephox.agar.api.Step',
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Representing',
    'ephox.alloy.api.component.GuiFactory',
    'ephox.alloy.api.events.AlloyTriggers',
    'ephox.alloy.api.events.NativeEvents',
    'ephox.alloy.api.ui.Container',
    'ephox.alloy.test.GuiSetup',
    'ephox.sugar.api.properties.Value'
  ],

  function (ApproxStructure, Assertions, FocusTools, Step, Behaviour, Representing, GuiFactory, AlloyTriggers, NativeEvents, Container, GuiSetup, Value) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    GuiSetup.setup(function (store, doc, body) {
      return GuiFactory.build(
        Container.sketch({
          dom: {
            tag: 'input'
          },
          containerBehaviours: Behaviour.derive([
            Representing.config({
              store: {
                mode: 'dataset',
                initialValue: {
                  value: 'dog',
                  text: 'Dog'
                },
                setData: function (component, data) {
                  Value.set(component.element(), data.text);
                },
                getDataKey: function (component) {
                  return Value.get(component.element());
                },
                getFallbackEntry: function (key) {
                  return { value: key.toLowerCase(), text: key };
                }
              }
            })
          ])
        })
      );
    }, function (doc, body, gui, component, store) {
      var sAssertValue = function (label, expected) {
        return Step.sync(function () {
          var v = Representing.getValue(component);
          Assertions.assertEq(label, expected, v);
        });
      };

      return [
        Assertions.sAssertStructure(
          'Initial value should be "dog"',
          ApproxStructure.build(function (s, str, arr) {
            return s.element('input', {
              value: str.is('Dog')
            });
          }),
          component.element()
        ),

        sAssertValue('Checking represented value on load', { value: 'dog', text: 'Dog' }),

        FocusTools.sSetFocus('Setting of focus on input field', gui.element(), 'input'),
        FocusTools.sSetActiveValue(doc, 'Cat'),
        // Note, Value.set does not actually dispatch the event, so we have to simulate it.
        Step.sync(function () {
          AlloyTriggers.emit(component, NativeEvents.input());
        }),

        sAssertValue('Checking represented value after change', { value: 'cat', text: 'Cat' }),

        Step.sync(function () {
          Representing.setValue(component, {
            value: 'elephant',
            text: 'Elephant'
          });
        }),

        sAssertValue('Checking represented value after setValue', { value: 'elephant', text: 'Elephant' }),
        Assertions.sAssertStructure(
          'Value should be "Elephant"',
          ApproxStructure.build(function (s, str, arr) {
            return s.element('input', {
              value: str.is('Elephant')
            });
          }),
          component.element()
        )
      ];
    }, function () { success(); }, failure);

  }
);