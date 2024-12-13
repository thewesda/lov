// Memory Game
// © 2014 Nate Wiley
// License -- MIT

// весь скрипт — это одна большая функция
(function(){
	
	//  объявляем объект, внутри которого будет происходить основная механика игры
	var Memory = {

		// создаём карточку
		init: function(cards){
			//  получаем доступ к классам
			this.$game = $(".game");
			this.$modal = $(".modal");
			this.$overlay = $(".modal-overlay");
			this.$restartButton = $("button.restart");
			// собираем из карточек массив — игровое поле
			this.cardsArray = $.merge(cards, cards);
			// перемешиваем карточки
			this.shuffleCards(this.cardsArray);
			// и раскладываем их
			this.setup();
		},

		// как перемешиваются карточки
		shuffleCards: function(cardsArray){
			// используем встроенный метод .shuffle
			this.$cards = $(this.shuffle(this.cardsArray));
		},

		// раскладываем карты
		setup: function(){
			// подготавливаем код с карточками на страницу
			this.html = this.buildHTML();
			// добавляем код в блок с игрой
			this.$game.html(this.html);
			// получаем доступ к сформированным карточкам
			this.$memoryCards = $(".card");
			// на старте мы не ждём переворота второй карточки
			this.paused = false;
			// на старте у нас нет перевёрнутой первой карточки
     		this.guess = null;
     		// добавляем элементам на странице реакции на нажатия
			this.binding();
		},

		// как элементы будут реагировать на нажатия
		binding: function(){
			// обрабатываем нажатие на карточку
			this.$memoryCards.on("click", this.cardClicked);
			// и нажатие на кнопку перезапуска игры
			this.$restartButton.on("click", $.proxy(this.reset, this));
		},

		// что происходит при нажатии на карточку
		cardClicked: function(){
			// получаем текущее состояние родительской переменной
			var _ = Memory;
			// и получаем доступ к карточке, на которую нажали
			var $card = $(this);
			// если карточка уже не перевёрнута и мы не нажимаем на ту же самую карточку второй раз подряд
			if(!_.paused && !$card.find(".inside").hasClass("matched") && !$card.find(".inside").hasClass("picked")){
				// переворачиваем её
				$card.find(".inside").addClass("picked");
				// если мы перевернули первую карточку
				if(!_.guess){
					// то пока просто запоминаем её
					_.guess = $(this).attr("data-id");
				// если мы перевернули вторую и она совпадает с первой
				} else if(_.guess == $(this).attr("data-id") && !$(this).hasClass("picked")){
					// оставляем обе на поле перевёрнутыми и показываем анимацию совпадения
					$(".picked").addClass("matched");
					// обнуляем первую карточку
					_.guess = null;
						// если вторая не совпадает с первой
						} else {
							// обнуляем первую карточку
							_.guess = null;
							// не ждём переворота второй карточки
							_.paused = true;
							// ждём полсекунды и переворачиваем всё обратно
							setTimeout(function(){
								$(".picked").removeClass("picked");
								Memory.paused = false;
							}, 600);
						}
				// если мы перевернули все карточки
				if($(".matched").length == $(".card").length){
					// показываем победное сообщение
					_.win();
				}
			}
		},

		// показываем победное сообщение
		win: function(){
			// не ждём переворота карточек
			this.paused = true;
			// плавно показываем модальное окно с предложением сыграть ещё
			setTimeout(function(){
				Memory.showModal();
				Memory.$game.fadeOut();
			}, 1000);
		},

		// показываем модальное окно
		showModal: function(){
			// плавно делаем блок с сообщением видимым
			this.$overlay.show();
			this.$modal.fadeIn("slow");
		},

		// прячем модальное окно
		hideModal: function(){
			this.$overlay.hide();
			this.$modal.hide();
		},

		// перезапуск игры
		reset: function(){
			// прячем модальное окно с поздравлением
			this.hideModal();
			window.location.href = 'index3.html';
		},

		// Тасование Фишера–Йетса - https://bost.ocks.org/mike/shuffle/
		shuffle: function(array){
			var counter = array.length, temp, index;
		   	while (counter > 0) {
	        	index = Math.floor(Math.random() * counter);
	        	counter--;
	        	temp = array[counter];
	        	array[counter] = array[index];
	        	array[index] = temp;
		    	}
		    return array;
		},

		// код, как добавляются карточки на страницу
		buildHTML: function(){
			// сюда будем складывать HTML-код
			var frag = '';
			// перебираем все карточки подряд
			this.$cards.each(function(k, v){
				// добавляем HTML-код для очередной карточки
				frag += '<div class="card" data-id="'+ v.id +'"><div class="inside">\
				<div class="front"><img src="'+ v.img +'"\
				alt="'+ v.name +'" /></div>\
				<div class="back"><img src="https://abrakadabra.fun/uploads/posts/2022-12/1670424932_1-abrakadabra-fun-p-estetika-serdechek-1.jpg"\
				alt="Codepen" /></div></div>\
				</div>';
			});
			// возвращаем собранный код
			return frag;
		}
	};

	// карточки
	var cards = [
		{	
			// название
			name: "php",
			// адрес картинки
			img: "https://m.media-amazon.com/images/I/51Ru-tLIKcL._AC_UL800_QL65_.jpg",
			// порядковый номер пары
			id: 1,
		},
		{
			name: "css3",
			img: "https://i.pinimg.com/736x/0e/e6/51/0ee6511eea2dbc2ace8d6aa4e484365e.jpg",
			id: 2
		},
		{
			name: "html5",
			img: "https://i.pinimg.com/736x/0f/60/4c/0f604c978a2d3951cca588349fca3c96.jpg",
			id: 3
		},
		{
			name: "jquery",
			img: "https://i.pinimg.com/736x/ea/f0/9b/eaf09b819c79b23cd708bb5ff6bbe2ce.jpg",
			id: 4
		}, 
		{
			name: "javascript",
			img: "https://i.pinimg.com/736x/43/93/99/439399be64d7633f887ff30e9d829ee0.jpg",
			id: 5
		},
		{
			name: "node",
			img: "https://i.pinimg.com/736x/a5/d9/89/a5d98963a929d22b3ee87c7ab2273b01.jpg",
			id: 6
		},
		{
			name: "photoshop",
			img: "https://i.pinimg.com/736x/ca/0d/01/ca0d014533d6bb2f34a79cf500719e19.jpg",
			id: 7
		},
		{
			name: "python",
			img: "https://i.pinimg.com/736x/34/e0/ea/34e0ea9ad6adaf5abe3686d2a287a97f.jpg",
			id: 8
		},
		{
			name: "rails",
			img: "https://i.pinimg.com/736x/c9/d5/65/c9d5658ae83866ea908b6ba408814d34.jpg",
			id: 9
		},
		{
			name: "sass",
			img: "https://i.pinimg.com/736x/43/da/be/43dabe0aca01abb1227b876a2d2a546b.jpg",
			id: 10
		},
		{
			name: "sublime",
			img: "https://i.pinimg.com/originals/ee/e8/63/eee8639cd5c5f27a1a322933059622e9.gif",
			id: 11
		},
		{
			name: "wordpress",
			img: "https://i.pinimg.com/736x/d2/94/da/d294dac20716bc1f902b11e3407db459.jpg",
			id: 12
		},
	];
    
	// запускаем игру
	Memory.init(cards);


})();