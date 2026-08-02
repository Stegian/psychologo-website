document.addEventListener("DOMContentLoaded", () => {
      const slides = Array.from(document.querySelectorAll(".slide"));
      const track = document.querySelector(".carousel-track");
      const prevBtn = document.querySelector(".slider-nav--prev");
      const nextBtn = document.querySelector(".slider-nav--next");
      const dotsContainer = document.querySelector(".dots");

      let currentIndex = 0;
      let autoPlayId = null;
      const autoPlayDelay = 9000; // ms

      // Δημιουργία dots
      slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.className = "dot" + (i === 0 ? " dot--active" : "");
        dot.dataset.index = String(i);
        dotsContainer.appendChild(dot);
      });

      const dots = Array.from(document.querySelectorAll(".dot"));

      function updateSlides() {
        const n = slides.length;
        const slideWidth = slides[0].offsetWidth || track.clientWidth * 0.7;
        const offsetX = slideWidth * 0.75;

        slides.forEach((slide, index) => {
          let offset = (index - currentIndex + n) % n;
          if (offset > n / 2) offset -= n;

          const x = offset * offsetX;
          const isCenter = offset === 0;
          const isSide = Math.abs(offset) === 1;

          const scale = isCenter ? 1 : 0.92;
          const y = isCenter ? -6 : 4;
          const opacity = isCenter ? 1 : (isSide ? 0.9 : 0);

          slide.style.transform =
            `translate(-50%, -50%) translateX(${x}px) translateY(${y}px) scale(${scale})`;
          slide.style.zIndex = String(n - Math.abs(offset));
          slide.style.opacity = String(opacity);

          // ενεργοποιούμε / σβήνουμε το zoom animation
          if (isCenter) {
            slide.classList.add("slide--active");
            // reset το animation κάθε φορά
            const img = slide.querySelector("img");
            img.style.animation = "none";
            void img.offsetWidth; // force reflow
            img.style.animation = "";
          } else {
            slide.classList.remove("slide--active");
          }
        });

        dots.forEach((dot, i) => {
          dot.classList.toggle("dot--active", i === currentIndex);
        });
      }


      function goToSlide(index) {
        const n = slides.length;
        currentIndex = (index + n) % n; // κυκλικό
        updateSlides();
      }

      function stopAutoPlay() {
        if (autoPlayId !== null) {
          clearInterval(autoPlayId);
          autoPlayId = null;
        }
      }

      function startAutoPlay() {
        stopAutoPlay();
        autoPlayId = setInterval(() => {
          goToSlide(currentIndex + 1);
        }, autoPlayDelay);
      }

      function restartAutoPlay() {
        startAutoPlay();
      }

      prevBtn.addEventListener("click", () => {
        goToSlide(currentIndex - 1);
        restartAutoPlay();
      });

      nextBtn.addEventListener("click", () => {
        goToSlide(currentIndex + 1);
        restartAutoPlay();
      });

      slides.forEach((slide, index) => {
        slide.addEventListener("click", () => {
          goToSlide(index);
          restartAutoPlay();
        });
      });

      dots.forEach(dot => {
        dot.addEventListener("click", () => {
          const i = Number(dot.dataset.index);
          goToSlide(i);
          restartAutoPlay();
        });
      });

      window.addEventListener("resize", updateSlides);

      // αρχικό layout + autoplay
      updateSlides();
      startAutoPlay();
    });