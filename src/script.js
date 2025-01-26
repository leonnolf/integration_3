import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", function () {
  
  const progressBar = document.querySelector(".progress-bar");
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${progress}%`;
  });

  
  gsap.utils.toArray(".chapter").forEach((section) => {
    const content = section.querySelector(".chapter-content");

    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 50%",
        toggleActions: "play none none reverse",
      },
    })
      .to(content, { opacity: 1, display: "block", duration: 1 });
  });
});