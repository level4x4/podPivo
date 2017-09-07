(function(){
	var classNames = {
		basketItem: 'pp-basket-item',
		basketItemAmount: 'pp-basket-item-amount',
		basketItemAmountRemove: 'pp-basket-item-amount-remove',
		basketItemAmountAdd: 'pp-basket-item-amount-add',
		basketItemPrice: 'pp-basket-item-price',
		basketAllItemsPrice: 'pp-basket-all-items-price',

		active: 'active'
	};

	var ids = {};

	var selectors = pp.buildSelectors(classNames, ids);

	var renderBasketItems = function(){
		$(selectors.basketItem).each(function(){
			completeItem($(this));
		});
		completeAllPrice();
	};

	var completeItem = function($item) {
		var itemMin = parseInt($item.attr('data-item-min')) || 0;
		var itemMax = parseInt($item.attr('data-item-max')) || 0;
		var itemUnit = $item.attr('data-item-unit') || '';
		var itemAmount = parseInt($item.attr('data-item-amount')) || 0;
		var itemUnitPrice = parseInt($item.attr('data-item-unit-price')) || 0;
		var $basketItemAmount = $item.find(selectors.basketItemAmount);
		var $basketItemAmountRemove = $item.find(selectors.basketItemAmountRemove);
		var $basketItemAmountAdd = $item.find(selectors.basketItemAmountAdd);
		var $basketItemPrice = $item.find(selectors.basketItemPrice);

		$basketItemAmount.text(itemAmount + ' ' + itemUnit);
		$basketItemPrice.find('span').text(itemAmount * itemUnitPrice);

		if (itemMin >= itemAmount) {
			$basketItemAmountRemove.removeClass(classNames.active);
		} else {
			$basketItemAmountRemove.addClass(classNames.active);
		}

		if (itemMax <= itemAmount) {
			$basketItemAmountAdd.removeClass(classNames.active);
		} else {
			$basketItemAmountAdd.addClass(classNames.active);
		}
	};


	var completeAllPrice = function(){
		var priceSum = 0;
		$(selectors.basketItem).each(function(){
			var $this = $(this);
			var itemAmount = parseInt($this.attr('data-item-amount')) || 0;
			var itemUnitPrice = parseInt($this.attr('data-item-unit-price')) || 0;
			priceSum += (itemAmount * itemUnitPrice)
		});
		$(selectors.basketAllItemsPrice).find('span').text(priceSum);
	};

	$(function(){
		renderBasketItems();
	});

	$(document).on('click', selectors.basketItemAmountRemove, function(e){
		var $this = $(this);
		var $basketItem = $this.closest(selectors.basketItem);
		var itemMin = parseInt($basketItem.attr('data-item-min')) || 0;
		var itemStep = parseInt($basketItem.attr('data-item-step')) || 0;
		var itemAmount = parseInt($basketItem.attr('data-item-amount')) || 0;
		var newItemAmount = itemAmount - itemStep;
		if (newItemAmount < itemMin) {
			return;
		}
		$basketItem.attr('data-item-amount', newItemAmount);
		completeItem($basketItem);
		completeAllPrice();
		e.preventDefault();
		e.stopPropagation();
		return false;
	});

	$(document).on('click', selectors.basketItemAmountAdd, function(e){
		var $this = $(this);
		var $basketItem = $this.closest(selectors.basketItem);
		var itemStep = parseInt($basketItem.attr('data-item-step')) || 0;
		var itemAmount = parseInt($basketItem.attr('data-item-amount')) || 0;
		$basketItem.attr('data-item-amount', itemAmount + itemStep);
		completeItem($basketItem);
		completeAllPrice();
		e.preventDefault();
		e.stopPropagation();
		return false;
	});
})();