$(function () {

// Шапка

  //////////////// скрыть верхнюю навигацию при скролле вниз

    if ($(window).width() > 768) { //только на десктопе
      var scrollPos = 0;
      $(window).scroll(function(){
         var st = $(this).scrollTop();
         if (st > scrollPos){
           $('.menu').addClass('hide');
         } else {
           $('.menu').removeClass('hide');
         }
         scrollPos = st;
      });
    }

  //////////////// выпадающее полное меню

    $('.menu__btn').click(function(e) {
      e.preventDefault();
      $('.full-menu').toggleClass('full-menu--open')
    });

    $(document).click(function(e){
      if (!$('.menu__btn').is(e.target) // если наведение не по кнопке
          && !$('.full-menu').is(e.target) // если наведение не по меню
          && $('.full-menu').has(e.target).length === 0) { // и не по его дочерним элементам
        $('.full-menu').removeClass('full-menu--open');
      }
    });

    $(window).keydown(function(e) {
      if (e.keyCode === 27) { //клавиша ESC
        e.preventDefault();
        $('.full-menu').removeClass('full-menu--open');
        
      }
    });

    if ($(window).width() <= 768) { // на мобильном

      $('.menu__btn').click(function(e) {
        $('body').toggleClass('overflow-h');
      });

      $('.full-menu__cat').click(function(e) {
        e.preventDefault();
        if ($(this).hasClass('active')) {
          $(this).removeClass('active');
          $('.full-menu__list').find('.full-menu__cat').show();
          $('.full-menu__sublist').find('.full-menu__link').show();
          $('.full-menu .site-nav').show();
        }
        else {
          $('.full-menu__list').find('.full-menu__cat').not(this).hide();
          $('.full-menu .site-nav').hide();
          $('.full-menu__list').find('.active').removeClass('active');
          $(this).addClass('active');
        } 
      });

      $('.full-menu__link').click(function(e) {
        if ($(this).next().is('ul')) {
          e.preventDefault();
          if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $('.full-menu__link').show();
          }
          else {
            $('.full-menu__link').not(this).hide();
            $('.full-menu__sublist').find('.active').removeClass('active');
            $(this).addClass('active');
          }
        }
      });
    }

  //////////////// выпадающая навигация на мобильном

    $('.site-nav__btn').click(function(e) {
      e.preventDefault();
      $('.site-nav').toggleClass('site-nav--open')
    });

  //////////////// помошник поиска https://jqueryui.com/autocomplete/

    var products = [
      "Смартфон Apple iPhone 7 32GB (3 товара)",
      "Смартфон Apple iPhone 7 128GB (2 товара)",
      "Смартфон Apple iPhone 7 Plus 32GB (золотой)",
      "Смартфон Apple iPhone 8 Plus 64GB (серебряный)",
      "Смартфон Apple iPhone 8 Plus 128GB (3 товара)",
      "Смартфон Apple iPhone 8 128GB (3 товара)"
    ];

    // var categories = [
    //   "Мобильные телефоны Apple (279 товаров)",
    //   "Смартфоны Apple (279 товаров)",
    //   "Защитные пленки и стекла для телефонов (87 товаров)",
    //   "Защитные пленки для iPhone (82 товара)",
    //   "Чехлы и сумки для телефонов (344 товара)",
    //   "Автомобильные зарядные устройства (2 товара)"
    // ];

    $('#search').autocomplete({
      source: products,
      autoFocus: true,
    });

  //////////////// popup при наведении на телефон

    $('.header__tel').mouseover(function(e) {
      e.preventDefault();
      $('.popup--about-tel').addClass('popup--open');
    });
    
    $(document).mouseover(function(e) {
      if (!$('.header__tel').is(e.target) // если наведение не по блоку
          && $('.header__tel').has(e.target).length === 0 // и не по его дочерним элементам
          && !$('.popup--about-tel').is(e.target)
          && $('.popup--about-tel').has(e.target).length === 0) {
        $('.popup--about-tel').removeClass('popup--open');
      }
    });


// Всплывающие окна

  //////////////// popup при клике на кнопки с атрибутами data-toggle="popup" и data-toggle="modal"

    $('[data-toggle="popup"],[data-toggle="modal"]').click(function(e) {
      e.preventDefault();
      $('.popup').removeClass('popup--open');
      $('.modal').removeClass('modal--open');

      var toggle = $(this).attr("data-toggle");
      var target = $(this).attr("data-target");
      if ( toggle == 'popup') {
        $('.'+target).addClass('popup--open');
      }
      if ( toggle == 'modal') {
        $('.'+target).addClass('modal--open');
      }
    });

    $(document).click(function(e){

      var btns = $('[data-toggle="popup"], [data-toggle="modal"]');
      var popup = $('.popup--open, .modal--open');

       if (!btns.is(e.target) // если клик был не по нашему блоку
        && !popup.is(e.target) && popup.has(e.target).length === 0) { // и не по его дочерним элементам
        popup.removeClass('popup--open').removeClass('modal--open');
      }

      if ( $('.popup--delivery-pickup, .popup--delivery-city, .popup--delivery-city-all').hasClass('popup--open') == true ) {
        $('body').addClass('overflow-h');
      } else {
        $('body').removeClass('overflow-h');
      }
    });

  //////////////// закрыть popup

    $('.popup__close').click(function(e) {
      e.preventDefault();
      $('body').removeClass('overflow-h');
      $(this).parents('.modal').removeClass('modal--open');
      $(this).parents('.popup').removeClass('popup--open');
    });


// Главная

  //////////////// слайдер акций

    $('.main__card-gallery').slick({
      autoplay: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: true,
      arrows: false,
      lazyLoad: 'progressive',
    });

  //////////////// popup при наведении на преимущества

      $('.main__benefit').mouseover(function(e) {
        e.preventDefault();
        $(this).find('.popup').addClass('popup--open');
      });
      
      $(document).mouseover(function(e) {
        if (!$('.main__benefit').is(e.target) // если наведение не по блоку
            && $('.main__benefit').has(e.target).length === 0 // и не по его дочерним элементам
            ) {
          $('.popup--benefit').removeClass('popup--open');
        }
      });

  //////////////// слайдер брендов

    $('.about-shop__brands').slick({
      // autoplay: true,
      slidesToShow: 6,
      slidesToScroll: 3,
      dots: true,
      lazyLoad: 'progressive',
      // variableWidth: true,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            arrows: false,
            slidesToShow: 3,
            slidesToScroll: 3,
          }
        }
      ]
    });


// Фильтры каталога

  //////////////// Выбрать тег

    $('.catalog__tag').click(function(e) {
      e.preventDefault();
      $(this).toggleClass('active');
      $('.catalog__tag-reset').removeClass('hide');
    });

    $('.catalog__tag-reset .btn').click(function(e) {
      e.preventDefault();
      $('.catalog__tag-reset').addClass('hide');
      $('.catalog__tag').removeClass('active');
    });

  //////////////// свернуть/раскрыть группу фильтра

    $('.filter__title').click(function(e) {
      e.preventDefault();
      $(this).parent().toggleClass('active');
    });

  //////////////// очистить выбранный фильтр

    $('.filter__clear').click(function(e) {
      e.preventDefault();
      $(this).parent('.filter').find('input').prop('checked', false).val("");
    });

  //////////////// очистить все фильтры

    $('.filters__clear').click(function(e) {
      e.preventDefault();
      $(this).parent('.filters').find('input').prop('checked', false).val("");
    });

  //////////////// свернуть/раскрыть скрытый список фильтра

    $('.filter__show-more').click(function(e) {
      e.preventDefault();
      $(this).find('.show-more').toggle();
      $(this).parent().find('.hidden').toggleClass('show');
    });

  //////////////// фильтры на мобильном в попапе

    if ($(window).width() <= 768) {
      $('.filters').addClass('popup');

      $('.filters-btn').click(function(e) {
        e.preventDefault();
        $('body').addClass('overflow-h');
        $('.filters').addClass('popup--open');
      });
    }


// Страница товара

  //////////////// фото-слайдер товара

    $('.product-big-photo').magnificPopup({
      delegate: 'a',
      type: 'image',
      tLoading: 'Загрузка #%curr%...',
      mainClass: 'mfp-img-mobile',
      gallery: {
        enabled: true,
        navigateByImgClick: true,
        preload: [0,1],
        tCounter: '',
      },
      image: {
        tError: '<a href="%url%">Изображение не загрузилось'
      }
    });

    $('.product-big-photo').slick({
      asNavFor: '.product-small-photos',
      dots: false,
      responsive: [
        {
          breakpoint: 480,
          dots: true,
        }
      ]
    });

    $('.product-small-photos').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      centerMode: true,
      centerPadding: 0,
      focusOnSelect: true,
      asNavFor: '.product-big-photo',
      responsive: [
        {
          breakpoint: 480,
          settings: "unslick"
        }
      ]
    });

  //////////////// вкладки товара
    $('.product-votes').click(function() {
      $('.product-tab-btn').removeClass('active');
      $('.product-tab-btn--responds').addClass('active');
    });

    $('.product-tab-btn').click(function(e) {
      e.preventDefault();
      $(this).parent().find('.active').removeClass('active');
      $(this).addClass('active');
    });


    if ($(window).width() > 768) { 
      $('.product-tab-btn:first-child').addClass('active');
    }

    if ($(window).width() <= 768) {
      $('.product-tab').addClass('popup');

      $('.product-tab-btn').click(function(e) {
        $('body').addClass('overflow-h'); //без прокрутки тела сайта
      });

      $('.product-tab .popup__close').click(function(e) {
        $('.product-tab-btn').removeClass('active');
      });
    }

  //////////////// вкладки точек самовывоза [также на странице Контакты]

    if ($(window).width() > 768) { //только на десктопе
      $('.popup__buttons').slick({
        slidesToShow: 5,
        vertical: true,
        variableWidth: true,
        focusOnSelect: true,
        asNavFor: '.popup__info-list',
      });

      $('.popup__info-list').slick({
        arrows: false,
        slidesToShow: 1,
        variableWidth: true,
        focusOnSelect: true,
        asNavFor: '.popup__buttons',
      });

      $('.pickup__buttons').slick({
        slidesToShow: 5,
        vertical: true,
        variableWidth: true,
        focusOnSelect: true,
        asNavFor: '.pickup__info-list',
      });

      $('.pickup__info-list').slick({
        arrows: false,
        slidesToShow: 1,
        // variableWidth: true,
        focusOnSelect: true,
        asNavFor: '.pickup__buttons',
        autoplay: true,
      });
    }

    if ($(window).width() <= 768) { //только на мобильном
      $('.pickup__info-item').addClass('popup');

      $('.pickup__buttons .button').click(function(e) {
        e.preventDefault();
        $('body').addClass('overflow-h');

        var id = $(this).attr('id');
        $('.'+id).addClass('popup--open');
      });
    }

  //////////////// селект (поле выбора)

    $(".dropdown-toggle").click(function(e) {
      e.preventDefault();
      $(this).toggleClass('dropdown-toggle--open');
    });

    $(".dropdown-menu li").click(function(e) {
      e.preventDefault();
      var select = $(this).text();
      $(this).parents(".dropdown").find(".dropdown-toggle").text(select);

      $(".dropdown-menu li").removeClass('active');
      $(this).addClass('active');
      $(".dropdown-toggle").removeClass('dropdown-toggle--open');
    });

// Корзина

  //////////////// поле ввода количества товара https://jqueryui.com/spinner/

    $('.cart-spinner').spinner({
      min: 1,
      max: 10,
    });

  //////////////// удалить товар из корзины

    $('.cart-remove').click(function(e) {
      e.preventDefault();
      $(this).parents('.cart-table-row').remove();
    });


// Избранное
  //////////////// Очистить список

    $('.catalog-fav-clear').click(function(e) {
      e.preventDefault();
      $('.catalog-fav .product-item').remove();
      $('.pagination').remove();
      $('.button--more').remove();
    });


// Страница оформления заказа

  //////////////// если поле ввода текста не пустое

    $(".input").on('input', function() {
      if ($(this).val()) {
        $(this).removeClass('input-empty');
      } else {
        $(this).addClass('input-empty');
      }
    });

  //////////////// выбор способа получения

    $(".tabs-delivery input[name='delivery-type']").on('change', function() {
      $('.tabs-method, .fields-address').addClass('d-none');

      if ($(this).val() == 'pickup-spb') {
        $('.field-pickup').removeClass('d-none');
      } else {
        $('.field-pickup').addClass('d-none');
      }
      if ($(this).val() == 'delivery-spb') {
        $('.tabs-city').removeClass('d-none');
      } else {
        $('.tabs-city').addClass('d-none');
      }
      if ($(this).val() == 'delivery-rus') {
        $('.tabs-city-all').removeClass('d-none');
      } else {
        $('.tabs-city-all').addClass('d-none');
      }
    });

  //////////////// Выбор города получения

    $(".search-help a, .delivery-city").click(function(e) {
      e.preventDefault();
      var city = $(this).text(); //сохраняем выбранный город
      if (city == 'Санкт-Петербург') {
        $('.order-our-courier').removeClass('d-none');
      }

      $('.select-city, .search-city').val(city).removeClass('input-empty');
      $('body').removeClass('overflow-h');
      $('.tabs-method').removeClass('d-none');
      $('.popup--delivery-city').removeClass('popup--open');
    });

  //////////////// выбор способа получения в городе (курьер/самовывоз)

    $(".tabs-method input[name='city-delivery-type']").on('change', function() {
      if ($("[value='our-courier'],[value='cdek-courier']").is(':checked')) {
        $('.field-pickup').addClass('d-none');
        $('.fields-address').removeClass('d-none');
      }
      if ($("[value='pickup']").is(':checked')) {
        $('.fields-address').addClass('d-none');
        $('.field-pickup').removeClass('d-none');
      }
    });

  //////////////// выбор пункта самовывоза

    $(".pickup__button").click(function() {
      var address = $(this).find(".pickup__button-address").text();
      $('.select-pickup').removeClass('input-empty').val(address);
      $('.select-pickup-address').removeClass('d-none').empty();
      $(this).clone().appendTo('.select-pickup-address');
      $('.order-total').removeClass('d-none');
      $('.buton-confirm').removeAttr('disabled');

      $(".popup--delivery-pickup").removeClass('popup--open');
    });

    if ($(window).width() <= 768) {
      $(".pickup__button").click(function() {
        $('.button.select-pickup').removeClass('d-none');
        $('.field-pickup .order-field').addClass('d-none');
      });
    }

  //////////////// Список/Карта пунктов на мобильном

    $(".tabs-view input[name='view-type']").on('change', function() {
      if ($("[value='list']").is(':checked')) {
        $('.pickup__info').addClass('d-none');
        $('.pickup__list').removeClass('d-none');
      }
      if ($("[value='map']").is(':checked')) {
        $('.pickup__list').addClass('d-none');
        $('.pickup__info').removeClass('d-none');
      }
    });

  //////////////// popup корзина
    $(".order__btn-cart").click(function(e) {
      e.preventDefault();
      $(this).toggleClass('open');
      if ($(this).hasClass('open') == true) {
        $(".popup--cart").removeClass('popup--open');
      } else {
        $(".popup--cart").addClass('popup--open');
      }

    });

// Контакты

  $('.pickup__photos').magnificPopup({
    delegate: 'a',
    type: 'image',
    tLoading: 'Загрузка #%curr%...',
    mainClass: 'mfp-img-mobile',
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0,1], // Will preload 0 - before current, and 1 after the current image
      tCounter: ''
    },
    image: {
      tError: '<a href="%url%">Изображение #%curr%</a> не загрузилось'
    }
  });

});