(function(){
	window.pp = {};

	$.fn.exists = function () {
		return this.length !== 0;
	};

	var classNames = {
		secondNav: 'pp-second-nav',
		effectNav: 'effect-nav',
		animationMenuItem: 'pp-animation-menu-item',
		productMenuContainer: 'pp-product-menu__container',
		product: 'pp-product',
		filters: 'pp-filters',
		productContent: 'pp-product-content',
		productMenuSmallIcons: 'pp-product-menu__small-icons',
		productDescriptionContainer: 'pp-product-description-container',
		productDescriptionContainerItem: 'pp-product-description-container__item',
		productDescriptionContainerClose: 'pp-product-description-container-close',
		parallaxSection: 'parallax-section',
		perfectScrollbar: 'perfect-scrollbar',
		menuItem: 'pp-menu-item',
		topMenu: 'pp-top-menu',
		fotorama: 'fotorama',
		scrollToSection: 'scroll-to-section',
		mobile: 'mobile',
		tablet: 'tablet',
		dotdotdot: 'dotdotdot',
		showAll: 'show-all',
		showShort: 'show-short',
		noFilter: 'no-filter',

		active: 'active',
		hide: 'hide',

		modal: 'modal',
		modalTitle: 'modal-title',
		modalBody: 'modal-body',
		modalFooter: 'modal-footer'
	};

	var ids = {};

	var buildSelectors = function (selectors, source, characterToPrependWith) {
		$.each(source, function (propertyName, value) {
			selectors[propertyName] = characterToPrependWith + value;
		});
	};

	pp.buildSelectors = function (classNames, ids) {
		var selectors = {};
		if (classNames) {
			buildSelectors(selectors, classNames, ".");
		}
		if (ids) {
			buildSelectors(selectors, ids, "#");
		}
		return selectors;
	};

	$.fn.anchorScroll = function(_options) {
		var sections = [];
		var $anchorScroll = $(this);
		var $a = $anchorScroll.find('a[href*="#"]:not([href="#"])');
		var options = {
			speed: 600,
			marginTop: 0
		};
		_options = $.extend({}, options, _options);

		$a.each(function(){
			var thisOffset = $(this.hash).offset();
			if (!thisOffset) {
				return false;
			}
			sections.push({
				link: $(this).parent(),
				top : (thisOffset.top - _options.marginTop).toFixed(0),
				bottom : (thisOffset.top + $(this.hash).outerHeight(true) - (_options.marginTop + 2)).toFixed(0)
			});
		});
		$a.off('click');
		$a.on('click', function(e){
			var $this = $(this.hash);
			var scrollTop = ($this.offset().top - (_options.marginTop)).toFixed(0);
			// var $clCheckedMenu = $(selectors.clCheckedMenu);
			// if ($clCheckedMenu.is(':checked')) {
			// 	$clCheckedMenu.removeAttr('checked');
			// }
			$('html, body').stop().animate({
				scrollTop: scrollTop
			}, _options.speed);
			e.preventDefault();
			e.stopPropagation();
		});

		$(window).on('scroll', function(e){
			for (var index in sections) {
				if ($(window).scrollTop() >= sections[index].top - 1 && $(window).scrollTop() <= sections[index].bottom) {
					sections[index].link.addClass(classNames.active).siblings().removeClass(classNames.active);
				}
			}
		});
	};

	pp.showModalDialog = function(parametrs) {
		var $modal = $(selectors.modal);
		var modalFooter = parametrs.modalFooter;
		$modal.find(selectors.modalTitle).text(parametrs.modalTitle || '');
		$modal.find(selectors.modalBody).html(parametrs.modalBody || '');

		if (!_.isEmpty(modalFooter)) {
			$modal.find(selectors.modalFooter).html('');
			for (var modalFooterIndex in modalFooter) {
				var btn = modalFooter[modalFooterIndex];
				var $btn = $('<button/>', {class: btn.btnClass, text: btn.btnName});
				$btn.on('click', btn.btnFunction);
				$modal.find(selectors.modalFooter).append($btn);
			}
		}

		$modal.modal('show');
	};

	var selectors = pp.buildSelectors(classNames, ids);

	var renderAnchorScroll = function() {
		$(selectors.effectNav).anchorScroll({
			marginTop: $(selectors.secondNav).outerHeight(true)
		});
	};

	$(function(){
		// $(selectors.effectNav).anchorScroll({marginTop: 30, speed: 500});
		$(selectors.perfectScrollbar).perfectScrollbar();
		setParallax();
		// setScrollify();
		renderDotdotdot();
		renderAnchorScroll();
	});

	var timerFunc;

	var renderDotdotdot = function() {
		$(selectors.dotdotdot).dotdotdot({
			ellipsis: '... ',
			height: 150,
			after: $('<a/>', {class: classNames.showAll, text: 'Показать весь текст'})
		});
	};

	var setScrollify = function() {
		$.scrollify({
			section : selectors.scrollToSection + ':not(.hide)',
			offset : - parseInt($(selectors.secondNav).outerHeight(true)),
			scrollSpeed: 1500,
			setHeights: false,
			overflowScroll: true,
			sectionName: false,
			updateHash: true,
			touchScroll: false,
			standardScrollElements: "footer, .beer",
			interstitialSection: "header, footer"
		});
	};

	var destroyScrollify = function() {
		$.scrollify.destroy();
		setScrollify();
	};

	var setParallax = function() {
		$(selectors.parallaxSection).parallax();
	};

	var destroyParallax = function() {
		$(selectors.parallaxSection).parallax('destroy');
		setParallax();
	};

	var onClickMenuProduct = function(e) {
		var $this = $(this);
		var thisOpenBlockName = $this.attr('data-open-block');
		var $product = $this.closest(selectors.product);
		var $topMenu = $product.find(selectors.topMenu);
		var $openBlockName = $product.find(selectors.productDescriptionContainerItem + '[data-block="' + thisOpenBlockName + '"]');

		$topMenu.find('a[data-open-block]').removeClass(classNames.active);
		$topMenu.find('a[data-open-block="' + thisOpenBlockName + '"]').addClass(classNames.active);
		$topMenu.addClass(classNames.active);
		$product.find(selectors.productDescriptionContainerItem).removeClass(classNames.active);
		$openBlockName.addClass(classNames.active);
		$product.addClass(classNames.active);
		$this.closest(selectors.productMenuContainer).addClass(classNames.active);
		$product.find('a').removeClass(classNames.active);
		$product.find('a[data-open-block="' + thisOpenBlockName + '"]').addClass(classNames.active);
		transitionEndsOnce($product.find(selectors.productDescriptionContainer), function(e) {
			$product.find(selectors.perfectScrollbar).perfectScrollbar('update');
			$product.find(selectors.fotorama).fotorama();
			clearInterval(timerFunc);
		});
		e.preventDefault();
		e.stopPropagation();
		return false;
	};

	function transitionEndsOnce($dom, callback) {
		var tick = Date.now();
		$dom.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function(e) {
			var diff = Date.now() - tick;
			tick = Date.now();
			if (diff > 20) { // this number can be changed, but normally all the event trigger are done in the same time
				timerFunc = setInterval(function (e) {
					callback && callback(e);
				}, 1000);
			}
		});
	}

	$(document).on('click', selectors.animationMenuItem, onClickMenuProduct);
	$(document).on('click', selectors.menuItem, onClickMenuProduct);

	$(document).on('click', selectors.productDescriptionContainerClose, function(e){
		var $this = $(this);
		var $product = $this.closest(selectors.product);
		$product.removeClass(classNames.active);
		$product.find(selectors.topMenu).removeClass(classNames.active);
		$product.find(selectors.productDescriptionContainerItem).removeClass(classNames.active);
		$product.find(selectors.productMenuContainer).removeClass(classNames.active);
		$product.find('a').removeClass(classNames.active);
		e.preventDefault();
		e.stopPropagation();
		return false;
	});

	$(document).on('click', selectors.filters + ' a', function(e) {
		var $this = $(this);
		if ($this.hasClass(classNames.noFilter)) {
			return;
		}
		var filterName = $this.attr('data-filter');
		var $product = $(selectors.product);
		$(selectors.filters).find('a').removeClass(classNames.active);
		$(this).addClass(classNames.active);
		$product.removeClass(classNames.hide);
		if (filterName) {
			$(selectors.product).not('[data-pp-filter="' + filterName + '"]').addClass(classNames.hide);
		}
		destroyParallax();
		// destroyScrollify();
		e.preventDefault();
		e.stopPropagation();
		return false;
	});

	$(document).on('click', selectors.productMenuSmallIcons, function(e){
		var $this = $(this);
		var $product = $this.closest(selectors.product);
		$product.addClass(classNames.active);
		$product.find(selectors.topMenu).addClass(classNames.active);
		e.preventDefault();
		e.stopPropagation();
		return false;
	});

	$(document).on('click', selectors.showAll, function(e){
		var $dotdotdot = $(selectors.dotdotdot);
		$dotdotdot.dotdotdot('destroy');
		$dotdotdot.append(
			$('<a/>', {class: classNames.showShort, text: 'Свернуть'})
		);
		e.preventDefault();
		e.stopPropagation();
		return false;
	});

	$(document).on('click', selectors.showShort, function(e){
		renderDotdotdot();
		$(this).remove();
		e.preventDefault();
		e.stopPropagation();
		return false;
	});

	$(window).on('resize', function(){
		renderAnchorScroll();
	});
})();