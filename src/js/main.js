$(function () {

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

//////////////// popup напомнить о дате анонса

  $('.button--remind').click(function(e) {
    e.preventDefault();
    $('.popup--remind').removeClass('popup--open');
    $(this).next('.popup--remind').addClass('popup--open');
  });

//////////////// popup АТ-Бонус

  $('.product-bonus').click(function(e) {
    e.preventDefault();
    $('.popup--bonus').removeClass('popup--open');
    $(this).next('.popup--bonus').addClass('popup--open');
  });

//////////////// popup--credit

  $('.product-card-credit').click(function(e) {
    e.preventDefault();
    $('.popup--credit').toggleClass('popup--open');
  });

//////////////// popup Точки для самовывоза

  $('.product-card-pickups').click(function(e) {
    e.preventDefault();
    $('.modal--pickup').toggleClass('modal--open');
  });

  $('.available').click(function(e) {
    e.preventDefault();
    $(this).next('.modal--pickup').addClass('modal--open');
  });

//////////////// popup Подарок при покупке

$(".label-gift").click(function(e) {
  e.preventDefault();
    $('.popup--gift').toggleClass('popup--open');
});

//////////////// popup Бесплатная доставка

$(".label-delivery-free").click(function(e) {
  e.preventDefault();
    $('.popup--delivery-free').toggleClass('popup--open');
});

//////////////// popup Купить в 1 клик

$(".button--one-click").click(function(e) {
  e.preventDefault();
    $('.popup--one-click').toggleClass('popup--open');
});

//////////////// закрыть popup

  $('.popup__close').click(function(e) {
    e.preventDefault();
    $('body').removeClass('overflow-h');
    $(this).parents('.modal').removeClass('modal--open');
    $(this).parents('.popup').removeClass('popup--open');
  });

//////////////// слайдер акций

  $('.main__card-gallery').slick({
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    lazyLoad: 'progressive',
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

//////////////// фото-слайдер товара

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

//////////////// вкладки точек самовывоза

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
    });
  }

  if ($(window).width() <= 768) {
    $('.pickup__info-item').addClass('popup');

    $('.pickup__buttons .button').click(function(e) {
      e.preventDefault();
      $('body').addClass('overflow-h');

      var id = $(this).attr('id');
      $('.'+id).addClass('popup--open');
    });
  }

//////////////// поле ввода количества товара https://jqueryui.com/spinner/

  $('.cart-spinner').spinner({
    min: 1,
    max: 10,
  });

//////////////// удалить товар из корзины

  $('.cart-remove').click(function(e) {
    e.preventDefault();
    $(this).parents('.bk_product').remove();
  });

//////////////// Очистить избранное

  $('.catalog-fav-clear').click(function(e) {
    e.preventDefault();
    $('.catalog-fav .product-item').remove();
    $('.pagination').remove();
    $('.button--more').remove();
  });

});