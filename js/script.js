document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       JESPER PHARMA - MAIN JAVASCRIPT
    ===================================================== */

    const API_BASE_URL = "http://localhost:3000";


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const menuButton =
        document.getElementById("menuButton");

    const mainNav =
        document.getElementById("mainNav");


    if (menuButton && mainNav) {

        menuButton.addEventListener(
            "click",
            function () {

                mainNav.classList.toggle("open");

            }
        );


        mainNav
            .querySelectorAll("a")
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        mainNav.classList.remove("open");

                    }
                );

            });

    }


    /* =====================================================
       PRODUCT FILTER
    ===================================================== */

    const filterButtons =
        document.querySelectorAll(".filter-btn");

    const productCards =
        document.querySelectorAll(".product-card");

    const noProducts =
        document.getElementById("noProducts");


    function filterProducts(selectedCategory) {

        let visibleProducts = 0;


        filterButtons.forEach(function (button) {

            const category =
                button.getAttribute("data-filter");

            if (category === selectedCategory) {

                button.classList.add("active");

            }
            else {

                button.classList.remove("active");

            }

        });


        productCards.forEach(function (card) {

            const productCategory =
                card.getAttribute("data-category");


            if (
                selectedCategory === "all" ||
                selectedCategory === productCategory
            ) {

                card.classList.remove("hide");

                visibleProducts++;

            }
            else {

                card.classList.add("hide");

            }

        });


        if (noProducts) {

            if (visibleProducts === 0) {

                noProducts.classList.add("show");

            }
            else {

                noProducts.classList.remove("show");

            }

        }

    }


    filterButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const selectedCategory =
                    button.getAttribute("data-filter");

                filterProducts(selectedCategory);

            }
        );

    });


    /* =====================================================
       PRODUCT MODAL
    ===================================================== */

    const productModal =
        document.getElementById("productModal");

    const modalOverlay =
        document.getElementById("modalOverlay");

    const modalClose =
        document.getElementById("modalClose");

    const modalTitle =
        document.getElementById("modalTitle");

    const modalCategory =
        document.getElementById("modalCategory");

    const modalDescription =
        document.getElementById("modalDescription");

    const modalEnquiry =
        document.getElementById("modalEnquiry");

    const viewProductButtons =
        document.querySelectorAll(".view-product");


    function closeProductModal() {

        if (!productModal) {
            return;
        }

        productModal.classList.remove("open");

        document.body.classList.remove("modal-open");

    }


    viewProductButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                if (
                    !productModal ||
                    !modalTitle ||
                    !modalCategory ||
                    !modalDescription
                ) {
                    return;
                }


                const title =
                    button.getAttribute("data-title") || "";

                const category =
                    button.getAttribute("data-category") || "";

                const description =
                    button.getAttribute("data-description") || "";


                modalTitle.textContent =
                    title;

                modalCategory.textContent =
                    category;

                modalDescription.textContent =
                    description;


                productModal.classList.add("open");

                document.body.classList.add("modal-open");

            }
        );

    });


    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeProductModal
        );

    }


    if (modalOverlay) {

        modalOverlay.addEventListener(
            "click",
            closeProductModal
        );

    }


    if (modalEnquiry) {

        modalEnquiry.addEventListener(
            "click",
            closeProductModal
        );

    }


    /* =====================================================
       CONTACT / ENQUIRY FORM
    ===================================================== */

    const enquiryForm =
        document.getElementById("enquiryForm");

    const fullName =
        document.getElementById("fullName");

    const phone =
        document.getElementById("phone");

    const email =
        document.getElementById("email");

    const company =
        document.getElementById("company");

    const enquiryType =
        document.getElementById("enquiryType");

    const message =
        document.getElementById("message");


    const nameError =
        document.getElementById("nameError");

    const phoneError =
        document.getElementById("phoneError");

    const emailError =
        document.getElementById("emailError");

    const typeError =
        document.getElementById("typeError");

    const messageError =
        document.getElementById("messageError");

    const formSuccess =
        document.getElementById("formSuccess");


    function clearError(input, errorElement) {

        if (input) {

            input.classList.remove("input-error");

        }

        if (errorElement) {

            errorElement.textContent = "";

        }

    }


    function showError(
        input,
        errorElement,
        errorMessage
    ) {

        if (input) {

            input.classList.add("input-error");

        }

        if (errorElement) {

            errorElement.textContent =
                errorMessage;

        }

    }


    function hideFormMessage() {

        if (!formSuccess) {
            return;
        }

        formSuccess.classList.remove("show");

    }


    function showFormMessage(
        text,
        type
    ) {

        if (!formSuccess) {
            return;
        }


        formSuccess.textContent =
            text;


        if (type === "error") {

            formSuccess.style.background =
                "#fdecec";

            formSuccess.style.color =
                "#9f2d2d";

            formSuccess.style.borderLeftColor =
                "#c33737";

        }
        else {

            formSuccess.style.background =
                "#eaf7ef";

            formSuccess.style.color =
                "#28633f";

            formSuccess.style.borderLeftColor =
                "#23844d";

        }


        formSuccess.classList.add("show");

    }


    function validateEnquiryForm() {

        let formValid = true;


        hideFormMessage();


        /* NAME */

        clearError(
            fullName,
            nameError
        );


        if (
            !fullName ||
            fullName.value.trim() === ""
        ) {

            showError(
                fullName,
                nameError,
                "Please enter your name."
            );

            formValid = false;

        }


        /* PHONE */

        clearError(
            phone,
            phoneError
        );


        const phoneNumber =
            phone
                ? phone.value.replace(/\D/g, "")
                : "";


        if (phoneNumber === "") {

            showError(
                phone,
                phoneError,
                "Please enter your phone number."
            );

            formValid = false;

        }
        else if (
            !/^[6-9][0-9]{9}$/.test(
                phoneNumber
            )
        ) {

            showError(
                phone,
                phoneError,
                "Enter a valid 10-digit mobile number."
            );

            formValid = false;

        }


        /* EMAIL */

        clearError(
            email,
            emailError
        );


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !email ||
            email.value.trim() === ""
        ) {

            showError(
                email,
                emailError,
                "Please enter your email address."
            );

            formValid = false;

        }
        else if (
            !emailPattern.test(
                email.value.trim()
            )
        ) {

            showError(
                email,
                emailError,
                "Please enter a valid email address."
            );

            formValid = false;

        }


        /* ENQUIRY TYPE */

        clearError(
            enquiryType,
            typeError
        );


        if (
            !enquiryType ||
            enquiryType.value === ""
        ) {

            showError(
                enquiryType,
                typeError,
                "Please select an enquiry type."
            );

            formValid = false;

        }


        /* MESSAGE */

        clearError(
            message,
            messageError
        );


        if (
            !message ||
            message.value.trim() === ""
        ) {

            showError(
                message,
                messageError,
                "Please enter your message."
            );

            formValid = false;

        }
        else if (
            message.value.trim().length < 10
        ) {

            showError(
                message,
                messageError,
                "Please provide a little more information."
            );

            formValid = false;

        }


        return formValid;

    }


    if (enquiryForm) {

        const submitButton =
            enquiryForm.querySelector(
                ".submit-button"
            );

        const originalButtonContent =
            submitButton
                ? submitButton.innerHTML
                : "";


        enquiryForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const formValid =
                    validateEnquiryForm();


                if (!formValid) {
                    return;
                }


                const phoneNumber =
                    phone.value.replace(
                        /\D/g,
                        ""
                    );


                const enquiryData = {

                    full_name:
                        fullName.value.trim(),

                    phone:
                        phoneNumber,

                    email:
                        email.value
                            .trim()
                            .toLowerCase(),

                    company:
                        company
                            ? company.value.trim()
                            : "",

                    enquiry_type:
                        enquiryType.value,

                    message:
                        message.value.trim()

                };


                if (submitButton) {

                    submitButton.disabled = true;

                    submitButton.innerHTML =
                        "Sending...";

                    submitButton.style.opacity =
                        "0.7";

                    submitButton.style.cursor =
                        "not-allowed";

                }


                hideFormMessage();


                try {

                    const response =
                        await fetch(
                            API_BASE_URL +
                            "/api/enquiries",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        enquiryData
                                    )
                            }
                        );


                    let result = {};


                    try {

                        result =
                            await response.json();

                    }
                    catch (error) {

                        result = {};

                    }


                    if (!response.ok) {

                        throw new Error(
                            result.message ||
                            "Unable to submit enquiry."
                        );

                    }


                    showFormMessage(
                        result.message ||
                        "Thank you. Your enquiry has been submitted successfully.",
                        "success"
                    );


                    enquiryForm.reset();


                    clearError(
                        fullName,
                        nameError
                    );

                    clearError(
                        phone,
                        phoneError
                    );

                    clearError(
                        email,
                        emailError
                    );

                    clearError(
                        enquiryType,
                        typeError
                    );

                    clearError(
                        message,
                        messageError
                    );


                    setTimeout(
                        function () {

                            hideFormMessage();

                        },
                        7000
                    );

                }
                catch (error) {

                    console.error(
                        "Enquiry submission error:",
                        error
                    );


                    showFormMessage(
                        error.message ||
                        "Unable to submit your enquiry. Please try again.",
                        "error"
                    );

                }
                finally {

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.innerHTML =
                            originalButtonContent;

                        submitButton.style.opacity =
                            "";

                        submitButton.style.cursor =
                            "";

                    }

                }

            }
        );


        /* Clear field error while typing */

        if (fullName) {

            fullName.addEventListener(
                "input",
                function () {

                    clearError(
                        fullName,
                        nameError
                    );

                }
            );

        }


        if (phone) {

            phone.addEventListener(
                "input",
                function () {

                    clearError(
                        phone,
                        phoneError
                    );

                }
            );

        }


        if (email) {

            email.addEventListener(
                "input",
                function () {

                    clearError(
                        email,
                        emailError
                    );

                }
            );

        }


        if (enquiryType) {

            enquiryType.addEventListener(
                "change",
                function () {

                    clearError(
                        enquiryType,
                        typeError
                    );

                }
            );

        }


        if (message) {

            message.addEventListener(
                "input",
                function () {

                    clearError(
                        message,
                        messageError
                    );

                }
            );

        }

    }


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".about-container, " +
            ".about-highlight-inner, " +
            ".business-heading, " +
            ".business-media, " +
            ".business-services, " +
            ".statement-container, " +
            ".why-container, " +
            ".products-top, " +
            ".product-grid, " +
            ".contact-container"
        );


    revealElements.forEach(
        function (element) {

            element.classList.add("reveal");

        }
    );


    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(

                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target
                                    .classList
                                    .add("visible");


                                revealObserver
                                    .unobserve(
                                        entry.target
                                    );

                            }

                        }
                    );

                },

                {
                    threshold: 0.12
                }

            );


        revealElements.forEach(
            function (element) {

                revealObserver.observe(
                    element
                );

            }
        );

    }
    else {

        revealElements.forEach(
            function (element) {

                element.classList.add(
                    "visible"
                );

            }
        );

    }


    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    const sections =
        document.querySelectorAll(
            "section[id]"
        );

    const navigationLinks =
        document.querySelectorAll(
            ".main-nav a"
        );


    function updateActiveNavigation() {

        let currentSection =
            "home";


        sections.forEach(
            function (section) {

                const sectionTop =
                    section.offsetTop - 160;


                if (
                    window.scrollY >=
                    sectionTop
                ) {

                    currentSection =
                        section.getAttribute(
                            "id"
                        );

                }

            }
        );


        navigationLinks.forEach(
            function (link) {

                link.classList.remove(
                    "active"
                );


                const href =
                    link.getAttribute(
                        "href"
                    );


                if (
                    href &&
                    href.startsWith("#")
                ) {

                    const linkTarget =
                        href.substring(1);


                    if (
                        linkTarget ===
                        currentSection
                    ) {

                        link.classList.add(
                            "active"
                        );

                    }

                }

            }
        );

    }


    window.addEventListener(
        "scroll",
        updateActiveNavigation,
        {
            passive: true
        }
    );


    updateActiveNavigation();


    /* =====================================================
       HEADER SHADOW
    ===================================================== */

    const siteHeader =
        document.querySelector(
            ".site-header"
        );


    function updateHeaderShadow() {

        if (!siteHeader) {
            return;
        }


        if (window.scrollY > 20) {

            siteHeader.classList.add(
                "header-shadow"
            );

        }
        else {

            siteHeader.classList.remove(
                "header-shadow"
            );

        }

    }


    window.addEventListener(
        "scroll",
        updateHeaderShadow,
        {
            passive: true
        }
    );


    updateHeaderShadow();


    /* =====================================================
       SNAPSHOT COUNTERS
    ===================================================== */

    const counters =
        document.querySelectorAll(
            ".counter"
        );

    const snapshotSection =
        document.querySelector(
            ".snapshot-section"
        );

    let counterStarted =
        false;


    function startCounters() {

        counters.forEach(
            function (counter) {

                const target =
                    Number(
                        counter.getAttribute(
                            "data-target"
                        )
                    );


                if (
                    Number.isNaN(target)
                ) {
                    return;
                }


                let current =
                    0;


                const increment =
                    Math.max(
                        1,
                        Math.ceil(
                            target / 60
                        )
                    );


                const timer =
                    setInterval(
                        function () {

                            current +=
                                increment;


                            if (
                                current >=
                                target
                            ) {

                                current =
                                    target;

                                clearInterval(
                                    timer
                                );

                            }


                            counter.textContent =
                                current + "+";

                        },
                        25
                    );

            }
        );

    }


    if (
        snapshotSection &&
        "IntersectionObserver" in window
    ) {

        const snapshotObserver =
            new IntersectionObserver(

                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting &&
                                !counterStarted
                            ) {

                                counterStarted =
                                    true;

                                startCounters();

                                snapshotObserver
                                    .disconnect();

                            }

                        }
                    );

                },

                {
                    threshold: 0.35
                }

            );


        snapshotObserver.observe(
            snapshotSection
        );

    }
    else if (
        snapshotSection &&
        !counterStarted
    ) {

        counterStarted = true;

        startCounters();

    }


    /* =====================================================
       MEGA MENU
    ===================================================== */

    const megaTriggers =
        document.querySelectorAll(
            ".mega-trigger"
        );

    const megaMenus =
        document.querySelectorAll(
            ".mega-menu"
        );

    const megaBackdrop =
        document.getElementById(
            "megaBackdrop"
        );

    const megaHeader =
        document.getElementById(
            "siteHeader"
        );


    let activeMegaMenu =
        null;

    let blockMegaHover =
        false;


    function pauseMegaVideos() {

        const videos =
            document.querySelectorAll(
                ".mega-menu video"
            );


        videos.forEach(
            function (video) {

                video.pause();

            }
        );

    }


    function playMegaVideo(menu) {

        pauseMegaVideos();


        if (!menu) {
            return;
        }


        const video =
            menu.querySelector(
                "video"
            );


        if (!video) {
            return;
        }


        const playPromise =
            video.play();


        if (
            playPromise !== undefined
        ) {

            playPromise.catch(
                function () {

                    /* Browser may block autoplay */

                }
            );

        }

    }


    function openMegaMenu(trigger) {

        if (
            blockMegaHover ||
            !trigger
        ) {
            return;
        }


        const menuId =
            trigger.getAttribute(
                "data-menu"
            );


        const selectedMenu =
            document.getElementById(
                menuId
            );


        if (!selectedMenu) {
            return;
        }


        megaMenus.forEach(
            function (menu) {

                menu.classList.remove(
                    "open"
                );

            }
        );


        megaTriggers.forEach(
            function (button) {

                button.classList.remove(
                    "menu-active"
                );

            }
        );


        selectedMenu.classList.add(
            "open"
        );


        trigger.classList.add(
            "menu-active"
        );


        if (megaBackdrop) {

            megaBackdrop.classList.add(
                "show"
            );

        }


        activeMegaMenu =
            selectedMenu;


        playMegaVideo(
            selectedMenu
        );

    }


    function closeMegaMenu() {

        megaMenus.forEach(
            function (menu) {

                menu.classList.remove(
                    "open"
                );

            }
        );


        megaTriggers.forEach(
            function (button) {

                button.classList.remove(
                    "menu-active"
                );

            }
        );


        if (megaBackdrop) {

            megaBackdrop.classList.remove(
                "show"
            );

        }


        pauseMegaVideos();


        activeMegaMenu =
            null;

    }


    megaTriggers.forEach(
        function (trigger) {

            trigger.addEventListener(
                "mouseenter",
                function () {

                    if (
                        window.innerWidth > 850 &&
                        !blockMegaHover
                    ) {

                        openMegaMenu(
                            trigger
                        );

                    }

                }
            );


            trigger.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    const menuId =
                        trigger.getAttribute(
                            "data-menu"
                        );


                    if (
                        window.innerWidth <= 850
                    ) {

                        if (
                            menuId ===
                            "aboutMega"
                        ) {

                            window.location.hash =
                                "about";

                        }
                        else if (
                            menuId ===
                            "businessMega"
                        ) {

                            window.location.hash =
                                "business";

                        }
                        else if (
                            menuId ===
                            "productsMega"
                        ) {

                            window.location.hash =
                                "products";

                        }


                        if (mainNav) {

                            mainNav.classList.remove(
                                "open"
                            );

                        }


                        return;

                    }


                    const selectedMenu =
                        document.getElementById(
                            menuId
                        );


                    if (
                        selectedMenu &&
                        selectedMenu
                            .classList
                            .contains("open")
                    ) {

                        closeMegaMenu();

                    }
                    else {

                        openMegaMenu(
                            trigger
                        );

                    }

                }
            );

        }
    );


    const megaLinks =
        document.querySelectorAll(
            ".mega-menu a"
        );


    megaLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    blockMegaHover =
                        true;

                    closeMegaMenu();

                }
            );

        }
    );


    if (megaHeader) {

        megaHeader.addEventListener(
            "mouseleave",
            function () {

                closeMegaMenu();

                blockMegaHover =
                    false;

            }
        );

    }


    if (megaBackdrop) {

        megaBackdrop.addEventListener(
            "click",
            function () {

                closeMegaMenu();

                blockMegaHover =
                    true;

            }
        );

    }


    const mainElement =
        document.querySelector(
            "main"
        );


    if (mainElement) {

        mainElement.addEventListener(
            "mouseenter",
            function () {

                blockMegaHover =
                    false;

            }
        );

    }


    window.addEventListener(
        "scroll",
        function () {

            if (activeMegaMenu) {

                closeMegaMenu();

                blockMegaHover =
                    true;

            }

        },
        {
            passive: true
        }
    );


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !== "Escape"
            ) {
                return;
            }


            closeProductModal();

            closeMegaMenu();

            blockMegaHover =
                true;

        }
    );


    /* =====================================================
       PRODUCT CATEGORY FROM MEGA MENU

       Required because index.html uses:
       onclick="selectProductCategory(...)"
    ===================================================== */

    window.selectProductCategory =
        function (category) {

            closeMegaMenu();


            const productsSection =
                document.getElementById(
                    "products"
                );


            if (productsSection) {

                productsSection.scrollIntoView({
                    behavior: "smooth"
                });

            }


            const filterButton =
                document.querySelector(
                    '.filter-btn[data-filter="' +
                    category +
                    '"]'
                );


            if (filterButton) {

                setTimeout(
                    function () {

                        filterButton.click();

                    },
                    300
                );

            }
            else {

                filterProducts(
                    category
                );

            }

        };

});