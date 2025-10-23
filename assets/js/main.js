/**
* Template Name: MediNest
* Template URL: https://bootstrapmade.com/medinest-bootstrap-hospital-template/
* Updated: Aug 11 2025 with Bootstrap v5.3.7
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

/*
====== Tambahan Sendiri ==========
*/

let nama = document.getElementById("nama")
let gender = document.getElementById("jeniskelamin")
let tinggi = document.getElementById("tinggi")
let berat = document.getElementById("berat")
let usia = document.getElementById("usia")
let frekuensi = document.getElementById("frekuensi")
let clickMaintain = document.getElementById("maintain-click")
let clickMildWeight = document.getElementById("mildWeight-click")
let clickWeightLoss = document.getElementById("weight-click")
let clickExtremeLoss = document.getElementById("extremeWeight-click")

let bmiScore = document.getElementById("bmiScore")
let BMIIndicator = document.getElementById("bmiIndicator")

let check = false

// Add a click event listener to the div

function validate() {
  let vNama = nama.value
  let vGender = gender.value
  let vTinggi = tinggi.value
  let vBerat = berat.value
  let vUsia = usia.value
  let vFrekuensi = frekuensi.value
  if (!vNama || !vGender || !vTinggi || !vBerat || !vUsia || !vFrekuensi) {
    alert("Please enter your data completely!")
  } else if(vTinggi <= 0 || vBerat <= 0 || vUsia <= 0){
    alert("Please enter your data correctly!")
  } else {
    check = true
  }
  localStorage.setItem("nama" , vNama)
  localStorage.setItem("berat" , vBerat)
  localStorage.setItem("tinggi" , vTinggi)
  localStorage.setItem("usia" , vUsia)
  localStorage.setItem("frekuensi" , vFrekuensi)
  localStorage.setItem("jeniskelamin" , vGender )

  calculateBMIScore()
  calculateIdealBodyWeight()
}

function calculateBMICategory(bmi) {
  if (bmi < 18.5) {
    localStorage.setItem("category" , "Underweight")
  } else if (bmi < 25) {
    localStorage.setItem("category" , "Healthy")
  } else if (bmi < 30) {
    localStorage.setItem("category" , "Overweight")
  } else {
    localStorage.setItem("category" , "Obese")
  }
}

function BMIIndicatorResult(bmi){
  let firstScoreRange, lastScoreRange
  let firstPercentageRange, lastPercentageRange

  if (bmi < 18.5) {
    firstScoreRange = 0
    lastScoreRange = 18.49

    firstPercentageRange = 0
    lastPercentageRange = 25
  } else if (bmi < 25) {
    firstScoreRange = 18.5
    lastScoreRange = 24.9

    firstPercentageRange = 25
    lastPercentageRange = 50
  } else if (bmi < 30) {
    firstScoreRange = 25
    lastScoreRange = 29.9

    firstPercentageRange = 50
    lastPercentageRange = 75
  } else {
    firstScoreRange = 30
    lastScoreRange = 40

    firstPercentageRange = 75
    lastPercentageRange = 100
  }

  let slope = (lastPercentageRange-firstPercentageRange) / (lastScoreRange-firstScoreRange)
  let intercept = firstPercentageRange - slope * firstScoreRange
  let percentage = Math.min(slope * bmi + intercept, 100)
  percentage = percentage + "%"
  localStorage.setItem("percentage" , percentage )
}

function calculateBMIScore() {
  let vTinggi = parseFloat(tinggi.value) / 100
  let vBerat = parseFloat(berat.value)
  if (check === true) {
    let bmi = (vBerat / Math.pow(vTinggi, 2)).toFixed(1);
    localStorage.setItem("bmi" , bmi)
    calculateBMICategory(bmi);
    BMIIndicatorResult(bmi);
    maintainWeight();
    window.location.href = "result.html";
  }
}

function calculateIdealBodyWeight(){
  let vTinggi = parseInt(tinggi.value)
  let vBerat = parseInt(berat.value)
  let vGender = gender.value
  console.log(vTinggi);
  console.log(vBerat);
  console.log(vGender);
  
  let beratIdeal = 0
  let reachIdeal = 0
  if(vTinggi > 152.4){
    let leftover = vTinggi % 152.4
    let leftover2 = leftover / 2.5
    let leftover3 = 0
    if(vGender === "Male"){
      leftover3 = leftover2 * 1.9
    }else{
      leftover3 = leftover2 * 1.7
    }
    beratIdeal = (52 + leftover3).toFixed(0)
  }else{
    beratIdeal = 52
  }
  reachIdeal = (beratIdeal - vBerat).toFixed(0)
  localStorage.setItem("ideal", beratIdeal)
  localStorage.setItem("reachIdeal" , reachIdeal)
}

function maintainWeight() {
  let vBerat = parseInt(berat.value)
  let vTinggi = parseInt(tinggi.value)
  let vUsia = parseInt(usia.value)
  let vGender = gender.value
  let vFrekuensi = parseFloat(frekuensi.value)
  
  let calories = 0

  if(vGender === "Male"){
    calories = ((10 * vBerat) + (6.25 * vTinggi) - (5 * vUsia) + 5) * vFrekuensi
  }else if(vGender === "Female"){
    calories = ((10 * vBerat) + (6.25 * vTinggi) - (5 * vUsia) - 161) * vFrekuensi
  }
  localStorage.setItem("calorie" , calories)
}


/*
====== Tambahan Sendiri ==========
*/

(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function () {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filters) {
      filters.addEventListener('click', function () {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle, .faq-item .faq-header').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

})();

