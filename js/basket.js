(function(){
	var classNames = {
		basketItem: 'pp-basket-item',
		basketItemHide: 'pp-basket-item-hide',
		basketItemAmount: 'pp-basket-item-amount',
		basketInputAmount: 'pp-basket-input-amount',
		basketItemAmountRemove: 'pp-basket-item-amount-remove',
		basketItemAmountAdd: 'pp-basket-item-amount-add',
		basketItemPrice: 'pp-basket-item-price',
		basketAllItemsPrice: 'pp-basket-all-items-price',
		basketAllInputPrice: 'pp-basket-all-input-price',

		basketItemDelete: 'pp-basket-item-delete',

		basketMessage: 'pp-basket-message',
		textCenter: 'text-center',
		basketTextInfo: 'pp-basket-text-info',

		active: 'active',
		modal: 'modal'
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
		var $basketInputAmount = $item.find(selectors.basketInputAmount);

		$basketInputAmount.val(itemAmount);
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
		var $basketItem = $(selectors.basketItem);
		if (!$basketItem.exists()) {
			$('main').html(
				$('<section/>', {class: [classNames.basketMessage, classNames.textCenter].join(' ')}).html(
					$('<p/>', {class: classNames.basketTextInfo, text: 'Корзина пуста'})
				)
			);
			return;
		}
		$basketItem.each(function(){
			var $this = $(this);
			var itemAmount = parseInt($this.attr('data-item-amount')) || 0;
			var itemUnitPrice = parseInt($this.attr('data-item-unit-price')) || 0;
			priceSum += (itemAmount * itemUnitPrice)
		});
		$(selectors.basketAllItemsPrice).find('span').text(priceSum);
		$(selectors.basketAllInputPrice).val(priceSum);
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

	$(document).on('click', selectors.basketItemDelete, function(e){
		var $this = $(this);
		var $basketItem = $this.closest(selectors.basketItem);
		pp.showModalDialog({
			modalTitle: 'Удаление товара',
			modalBody: 'Вы действительно хотите удалить ' + $basketItem.find('h2').text() + '?',
			modalFooter: [
				{
					btnName: 'Да',
					btnFunction: function () {
						$basketItem.addClass(classNames.basketItemHide);
						$basketItem.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function(e) {
							$basketItem.remove();
							renderBasketItems();
						});
						$(selectors.modal).modal('hide');
					},
					btnClass: 'btn btn-primary'
				},
				{
					btnName: 'Нет',
					btnFunction: function () {
						$(selectors.modal).modal('hide');
					},
					btnClass: 'btn btn-primary'
				}
			]
		});

		e.preventDefault();
		e.stopPropagation();
		return false;
	});

	$()
})();