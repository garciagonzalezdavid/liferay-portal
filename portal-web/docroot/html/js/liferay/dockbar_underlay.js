AUI().add(
	'liferay-dockbar-underlay',
	function(A) {
		Liferay.Dockbar._addUnderlay = function(options) {
			var instance = this;

			var autoShow = true;

			var underlay;
			var name = options.name;

			if (name) {
				autoShow = options.visible !== false;

				underlay = instance[name];

				if (!underlay) {
					delete options.name;

					options.zIndex = instance.underlayZIndex++;

					options.align = options.align || {
						node: instance.dockBar,
						points: ['tl', 'bl']
					};

					underlay = new Liferay.Dockbar.Underlay(options);

					underlay.render(instance.dockBar);

					var ioOptions = options.io;

					if (ioOptions) {
						ioOptions.loadingMask = {
							background: 'transparent'
						};

						underlay.plug(A.Plugin.IO, ioOptions);
					}

					instance[name] = underlay;
				}

				if (autoShow && underlay && underlay instanceof A.Overlay) {
					underlay.show();
				}
			}

			return underlay;
		};

		var Underlay = A.Component.create(
			{
				ATTRS: {
					bodyContent: {
						value: A.Node.create('<div style="height: 100px"></div>')
					},
					className: {
						lazyAdd: false,
						setter: function(value) {
							var instance = this;

							instance.get('boundingBox').addClass(value);
						},
						value: null
					}
				},

				EXTENDS: A.OverlayBase,

				NAME: 'underlay',

				prototype: {
					initializer: function() {
						var instance = this;

						Liferay.Dockbar.UnderlayManager.register(instance);
					},

					renderUI: function() {
						var instance = this;

						Underlay.superclass.renderUI.apply(instance, arguments);

						var closeTool = new A.ButtonItem('close');

						closeTool.render(instance.get('boundingBox'));

						closeTool.get('contentBox').addClass('aui-underlay-close');

						instance.set('headerContent', closeTool.get('boundingBox'));

						instance.closeTool = closeTool;
					},

					bindUI: function() {
						var instance = this;

						Underlay.superclass.bindUI.apply(instance, arguments);

						instance.closeTool.on('click', instance.hide, instance);
					}
				}
			}
		);

		Liferay.Dockbar.Underlay = Underlay;
	},
	'',
	{
		requires: ['aui-button-item', 'aui-io-plugin', 'aui-overlay-manager']
	}
);