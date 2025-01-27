import { disablePageScroll, enablePageScroll } from '@fluejs/noscroll';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

enablePageScroll();

document.addEventListener("DOMContentLoaded", function () {
    const progressBar = document.querySelector(".progress-bar");
    const pressImages = document.querySelector(".press-images");
    const handleImage = document.querySelector(".handle");
    const pressContainer = document.querySelector(".press-container");
    const handleSound = document.getElementById("handle-sound");
    const video = document.getElementById("animation-video");
    const opdevideo = document.querySelector(".opdevideo");
    let isDragging = false;
    let rotation = 0;

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
        }).to(content, { opacity: 1, display: "block", duration: 1 });
    });

    pressImages.addEventListener("click", () => {
        enablePageScroll();
        const nextChapter = document.querySelector("#chapter1");
        if (nextChapter) {
            nextChapter.scrollIntoView({ behavior: 'smooth' });
        }
    });

    ScrollTrigger.create({
        trigger: pressContainer,
        start: "top top",
        end: "bottom top",
        pin: true,
        markers: true,
        onEnter: () => {
            disablePageScroll();
            pressImages.addEventListener('mousedown', onMouseDown);
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        },
        onLeave: () => {
            enablePageScroll();
            pressImages.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        },
        onLeaveBack: () => {
            enablePageScroll();
            pressImages.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    });

    function onMouseDown(e) {
        isDragging = true;
        handleImage.style.transition = 'none';
        e.preventDefault();
        handleSound.currentTime = 0;
        handleSound.play();
    }

    function onMouseMove(e) {
        if (isDragging) {
            const deltaX = -e.movementX;
            if (rotation < 45) {
                rotation += deltaX * 0.5;
                if (rotation > 45) rotation = 45;
            }
            handleImage.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        }
    }

    function onMouseUp() {
        isDragging = false;
        handleImage.style.transition = 'transform 0.5s ease';
        if (rotation >= 45) {
            rotation = 0;
            handleImage.style.transform = `translate(-50%, -50%) rotate(0deg)`;
            handleSound.pause();
            handleSound.currentTime = 0;
        }
    }

    video.pause();

    gsap.to(video, {
        scrollTrigger: {
            trigger: video,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            markers: true,
            onEnterBack: () => video.pause(),
            onLeave: () => {
                video.play();
                video.onended = () => {
                    gsap.to(opdevideo, { opacity: 1, duration: 1, display: 'flex' });
                };
            },
        },
        currentTime: video.duration,
        ease: "none",
    });

    opdevideo.style.opacity = 0;
    opdevideo.style.display = 'none';

    ScrollTrigger.create({
        trigger: opdevideo,
        start: "top 80%",
        end: "top 50%",
        onEnter: () => {
            gsap.to(opdevideo, { opacity: 1, duration: 1 });
        },
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const videoDescription = document.querySelector(".video-description");
    const chapterImage = document.querySelector(".chapter-image");

    gsap.timeline({
        scrollTrigger: {
            trigger: "#animation-video",
            start: "top center",
            end: "bottom center",
            scrub: 1,
        },
    })
    .to(videoDescription, { opacity: 1, duration: 1 })
    .to(chapterImage, { opacity: 1, duration: 1 }, "-=0.5");
});

const video = document.getElementById("animation-video");
const videoDescription = document.querySelector(".video-description");
const chapterImage = document.querySelector(".chapter-image");

gsap.to(video, {
    scrollTrigger: {
        trigger: "#animation-video",
        start: "top 10%",
        end: "bottom bottom",
        scrub: 1,
        markers: true,
        onLeave: () => {
            gsap.to(videoDescription, { opacity: 1, duration: 1 });
            gsap.to(chapterImage, { opacity: 1, duration: 1 });
        },
    },
    currentTime: video.duration,
    ease: "none",
});

document.addEventListener('DOMContentLoaded', () => {
    const introContent = document.querySelector('.intro_content');
    const plantinImage = document.querySelector('.plantin');

    setTimeout(() => {
        introContent.classList.add('show');
        plantinImage.classList.add('show');
    }, 300);
});

document.getElementById("hamburger").addEventListener("click", () => {
    const navLinks = document.getElementById("nav-links");
    navLinks.classList.toggle("active");
});

document.addEventListener("DOMContentLoaded", function () {
    const progressBar = document.querySelector(".progress-bar");
    const chapters = document.querySelectorAll(".chapter");

    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${progress}%`;
    });

    const applyScrollAnimations = (chapter) => {
        const content = chapter.querySelector(".content");
        const video = chapter.querySelector("video");
        const opdevideo = chapter.querySelector(".opdevideo");

        gsap.timeline({
            scrollTrigger: {
                trigger: chapter,
                start: "top 80%",
                end: "top 50%",
                toggleActions: "play none none reverse",
            },
        }).to(content, { opacity: 1, display: "block", duration: 1 });

        if (video) {
            video.pause();

            gsap.timeline({
                scrollTrigger: {
                    trigger: video,
                    start: "top center",
                    end: "bottom center",
                    scrub: 1,
                    onEnter: () => video.play(),
                    onEnterBack: () => video.play(),
                    onLeave: () => video.pause(),
                },
            });

            video.onended = () => {
                if (opdevideo) {
                    gsap.to(opdevideo, { opacity: 1, duration: 1, display: "flex" });
                }
            };
        }
    };

    chapters.forEach((chapter) => applyScrollAnimations(chapter));
});