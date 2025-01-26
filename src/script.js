import { disablePageScroll, enablePageScroll } from '@fluejs/noscroll';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Enable scrolling by default
enablePageScroll();

document.addEventListener("DOMContentLoaded", function () {
    const progressBar = document.querySelector(".progress-bar");
    const pressImages = document.querySelector(".press-images");
    const handleImage = document.querySelector(".handle"); // Selecteer de handle afbeelding
    const pressContainer = document.querySelector(".press-container");
    const handleSound = document.getElementById("handle-sound"); // Selecteer het audio-element
    let isDragging = false;
    let rotation = 0;

    // Progress bar logic
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

    // Enable scrolling on press image click
    pressImages.addEventListener("click", () => {
        console.log("Press image clicked - enabling scroll");
        enablePageScroll();
        const nextChapter = document.querySelector("#chapter1");
        if (nextChapter) {
            nextChapter.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Scroll blocking for the press container with markers
    ScrollTrigger.create({
        trigger: pressContainer,
        start: "top top", // When the top of the container hits the top of the viewport
        end: "bottom top", // When the bottom of the container hits the top of the viewport
        pin: true,
        markers: true, // Enable markers for debugging
        onEnter: () => {
            console.log("Scroll disabled - press container entered");
            disablePageScroll();

            // Start mouse event listeners
            pressImages.addEventListener('mousedown', onMouseDown);
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        },
        onLeave: () => {
            console.log("Scroll enabled - press container left");
            enablePageScroll();
            // Clean up mouse event listeners
            pressImages.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        },
        onLeaveBack: () => {
            console.log("Scroll enabled - leaving back");
            enablePageScroll();
            // Clean up mouse event listeners
            pressImages.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    });

    function onMouseDown(e) {
        isDragging = true;
        handleImage.style.transition = 'none'; // Disable transition for smooth dragging
        e.preventDefault(); // Prevent default behavior to avoid selecting the image

        // Start playing the sound immediately when dragging starts
        handleSound.currentTime = 0; // Reset sound to start
        handleSound.play(); // Play sound
    }

    function onMouseMove(e) {
        if (isDragging) {
            // Calculate the rotation based on mouse movement (corrected)
            const deltaX = -e.movementX; // Negate to fix rotation direction
            // Update rotation, limit to a maximum of 45 degrees to the right
            if (rotation < 45) {
                rotation += deltaX * 0.5; // Adjust rotation sensitivity for faster rotation
                if (rotation > 45) rotation = 45; // Clamp to 45 degrees
            }
            handleImage.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`; // Apply rotation only to the handle
        }
    }

    function onMouseUp() {
        isDragging = false;
        handleImage.style.transition = 'transform 0.5s ease'; // Re-enable transition for final rotation
        // Reset the rotation immediately if it reaches 45 degrees
        if (rotation >= 45) {
            console.log("Rotation complete - resetting position");
            rotation = 0; // Reset to original position
            handleImage.style.transform = `translate(-50%, -50%) rotate(0deg)`; // Reset to initial position
            handleSound.pause(); // Stop the sound when resetting
            handleSound.currentTime = 0; // Reset sound to start
        }
    }

    // Zorg ervoor dat je GSAP hebt geladen in je project

    // Wacht tot de DOM is geladen
    document.addEventListener('DOMContentLoaded', () => {
        // Selecteer de tekstballon
        const speechBubble = document.querySelector('.speech-bubble');

        // Voeg een animatie toe wanneer de pagina is geladen
        gsap.fromTo(speechBubble, 
            { opacity: 0, y: 20 }, // Beginpositie
            { 
                opacity: 1, 
                y: 0, 
                duration: 1, 
                ease: 'power2.out' // Animatie effect
            }
        );
    });

    const video = document.getElementById("animation-video");

    // Ensure the video doesn't play automatically
    video.pause();

    // Use GSAP to control the video playback
    gsap.to(video, {
      scrollTrigger: {
        trigger: "#animation-video", // The video element
        start: "top 10%", // Start playing when in view
        end: "bottom 1%", // Stop when scrolled out
        scrub: 1, // Sync playback with scroll
        markers: true,
      },
      currentTime: video.duration, // Progress through the video's duration
      ease: "none",
    });
});