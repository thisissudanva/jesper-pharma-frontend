const menuButton =
    document.getElementById("menuButton");

const mainNav =
    document.getElementById("mainNav");


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

/* =====================================================
   PRODUCT FILTER
===================================================== */

const filterButtons =
    document.querySelectorAll(".filter-btn");

const productCards =
    document.querySelectorAll(".product-card");

const noProducts =
    document.getElementById("noProducts");


filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const selectedCategory =
            button.getAttribute("data-filter");


        /* Active button change */

        filterButtons.forEach(function (btn) {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        let visibleProducts = 0;


        /* Product filtering */

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


        /* No products message */

        if (visibleProducts === 0) {

            noProducts.classList.add("show");

        }

        else {

            noProducts.classList.remove("show");

        }

    });

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


/* Open modal */

viewProductButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const title =
            button.getAttribute("data-title");

        const category =
            button.getAttribute("data-category");

        const description =
            button.getAttribute("data-description");


        modalTitle.textContent =
            title;

        modalCategory.textContent =
            category;

        modalDescription.textContent =
            description;


        productModal.classList.add("open");

        document.body.classList.add("modal-open");

    });

});


/* Close modal */

function closeProductModal() {

    productModal.classList.remove("open");

    document.body.classList.remove("modal-open");

}


modalClose.addEventListener(
    "click",
    closeProductModal
);


modalOverlay.addEventListener(
    "click",
    closeProductModal
);


/* ESC key */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            productModal.classList.contains("open")
        ) {

            closeProductModal();

        }

    }
);


/* Close modal when enquiry clicked */

modalEnquiry.addEventListener(
    "click",
    closeProductModal
);

/* =====================================================
   CONTACT FORM VALIDATION
===================================================== */

const enquiryForm =
    document.getElementById("enquiryForm");


const fullName =
    document.getElementById("fullName");

const phone =
    document.getElementById("phone");

const email =
    document.getElementById("email");

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



/* =====================================================
   CLEAR ERROR
===================================================== */

function clearError(input, errorElement) {

    input.classList.remove("input-error");

    errorElement.textContent = "";

}



/* =====================================================
   SHOW ERROR
===================================================== */

function showError(
    input,
    errorElement,
    message
) {

    input.classList.add("input-error");

    errorElement.textContent = message;

}



/* =====================================================
   FORM SUBMIT
===================================================== */

enquiryForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        let formValid = true;


        /* Clear previous success */

        formSuccess.classList.remove("show");



        /* ---------------------------
           NAME
        --------------------------- */

        clearError(
            fullName,
            nameError
        );


        if (
            fullName.value.trim() === ""
        ) {

            showError(
                fullName,
                nameError,
                "Please enter your name."
            );

            formValid = false;

        }



        /* ---------------------------
           PHONE
        --------------------------- */

        clearError(
            phone,
            phoneError
        );


        const phoneNumber =
            phone.value
                .replace(/\D/g, "");


        if (
            phoneNumber === ""
        ) {

            showError(
                phone,
                phoneError,
                "Please enter your phone number."
            );

            formValid = false;

        }

        else if (
            !/^[6-9][0-9]{9}$/
                .test(phoneNumber)
        ) {

            showError(
                phone,
                phoneError,
                "Enter a valid 10-digit mobile number."
            );

            formValid = false;

        }



        /* ---------------------------
           EMAIL
        --------------------------- */

        clearError(
            email,
            emailError
        );


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
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



        /* ---------------------------
           ENQUIRY TYPE
        --------------------------- */

        clearError(
            enquiryType,
            typeError
        );


        if (
            enquiryType.value === ""
        ) {

            showError(
                enquiryType,
                typeError,
                "Please select an enquiry type."
            );

            formValid = false;

        }



        /* ---------------------------
           MESSAGE
        --------------------------- */

        clearError(
            message,
            messageError
        );


        if (
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



        /* =================================================
           SUCCESS
        ================================================= */

        if (formValid) {

            formSuccess.classList.add(
                "show"
            );


            enquiryForm.reset();


            setTimeout(
                function () {

                    formSuccess
                        .classList
                        .remove("show");

                },
                6000
            );

        }

    }
);

/* =====================================================
   SCROLL REVEAL
===================================================== */

const revealElements = document.querySelectorAll(
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


revealElements.forEach(function (element) {
    element.classList.add("reveal");
});


const revealObserver =
    new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach(function (element) {

    revealObserver.observe(element);

});



/* =====================================================
   ACTIVE NAVIGATION ON SCROLL
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

    let currentSection = "home";


    sections.forEach(function (section) {

        const sectionTop =
            section.offsetTop - 160;


        if (
            window.scrollY >= sectionTop
        ) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navigationLinks.forEach(
        function (link) {

            link.classList.remove(
                "active"
            );


            const linkTarget =
                link
                    .getAttribute("href")
                    .replace("#", "");


            if (
                linkTarget === currentSection
            ) {

                link.classList.add(
                    "active"
                );

            }

        }
    );

}


window.addEventListener(
    "scroll",
    updateActiveNavigation
);


updateActiveNavigation();



/* =====================================================
   HEADER SHADOW ON SCROLL
===================================================== */

const siteHeader =
    document.querySelector(
        ".site-header"
    );


window.addEventListener(
    "scroll",
    function () {

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
);


/* =====================================================
   SNAPSHOT COUNTER
===================================================== */

const counters =
    document.querySelectorAll(".counter");


let counterStarted = false;


const snapshotSection =
    document.querySelector(".snapshot-section");


const snapshotObserver =
    new IntersectionObserver(

        function (entries) {

            entries.forEach(
                function (entry) {

                    if (
                        entry.isIntersecting &&
                        !counterStarted
                    ) {

                        counterStarted = true;

                        startCounters();

                    }

                }
            );

        },

        {
            threshold: 0.35
        }

    );


if (snapshotSection) {

    snapshotObserver.observe(
        snapshotSection
    );

}



function startCounters() {

    counters.forEach(
        function (counter) {

            const target =
                Number(
                    counter.getAttribute(
                        "data-target"
                    )
                );


            let current = 0;


            const increment =
                Math.max(
                    1,
                    Math.ceil(target / 60)
                );


            const timer =
                setInterval(
                    function () {

                        current += increment;


                        if (
                            current >= target
                        ) {

                            current = target;

                            clearInterval(timer);

                        }


                        counter.textContent =
                            current + "+";

                    },

                    25
                );

        }
    );

}

/* =====================================================
   JESPER MEGA MENU
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


let activeMegaMenu = null;



/* =====================================================
   OPEN MENU
===================================================== */

function openMegaMenu(trigger) {

    const menuId =
        trigger.getAttribute(
            "data-menu"
        );


    const selectedMenu =
        document.getElementById(
            menuId
        );


    /*
        Close previously open menu
    */

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


    /*
        Open requested menu
    */

    selectedMenu.classList.add(
        "open"
    );


    trigger.classList.add(
        "menu-active"
    );


    megaBackdrop.classList.add(
        "show"
    );


    activeMegaMenu =
        selectedMenu;


    /*
        Start video if browser paused it
    */

    const video =
        selectedMenu.querySelector(
            "video"
        );


    if (video) {

        video.play().catch(
            function () {
                /* autoplay may be blocked */
            }
        );

    }

}



/* =====================================================
   CLOSE MENU
===================================================== */

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


    megaBackdrop.classList.remove(
        "show"
    );


    activeMegaMenu = null;

}



/* =====================================================
   DESKTOP HOVER
===================================================== */

megaTriggers.forEach(
    function (trigger) {


        /*
            Hover opens menu
        */

        trigger.addEventListener(
            "mouseenter",
            function () {

                if (
                    window.innerWidth > 850
                ) {

                    openMegaMenu(
                        trigger
                    );

                }

            }
        );


        /*
            Click also works
        */

        trigger.addEventListener(
            "click",
            function () {

                if (
                    window.innerWidth <= 850
                ) {

                    /*
                       On mobile, go to section
                    */

                    const target =
                        trigger.textContent
                            .trim()
                            .toLowerCase();


                    if (
                        target.includes(
                            "about"
                        )
                    ) {

                        location.hash =
                            "about";

                    }


                    else if (
                        target.includes(
                            "business"
                        )
                    ) {

                        location.hash =
                            "business";

                    }


                    else if (
                        target.includes(
                            "products"
                        )
                    ) {

                        location.hash =
                            "products";

                    }


                    mainNav.classList.remove(
                        "open"
                    );

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


                if (
                    selectedMenu.classList
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



/* =====================================================
   KEEP OPEN WHILE CURSOR IS INSIDE MENU
===================================================== */

megaMenus.forEach(
    function (menu) {

        menu.addEventListener(
            "mouseenter",
            function () {

                activeMegaMenu = menu;

            }
        );

    }
);



/* =====================================================
   CLOSE WHEN LEAVING HEADER AREA
===================================================== */

const siteHeaderMega =
    document.getElementById(
        "siteHeader"
    );


siteHeaderMega.addEventListener(
    "mouseleave",
    function () {

        if (
            window.innerWidth > 850
        ) {

            setTimeout(
                function () {

                    if (
                        !siteHeaderMega.matches(
                            ":hover"
                        )
                    ) {

                        closeMegaMenu();

                    }

                },
                100
            );

        }

    }
);



/* =====================================================
   CLICK BACKDROP
===================================================== */

megaBackdrop.addEventListener(
    "click",
    closeMegaMenu
);



/* =====================================================
   ESC KEY
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeMegaMenu();

        }

    }
);



/* =====================================================
   LINKS INSIDE MEGA MENU
===================================================== */

document
    .querySelectorAll(
        ".mega-menu a"
    )
    .forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    closeMegaMenu();

                }
            );

        }
    );

    /* =====================================================
   CLOSE MEGA MENU WHEN PAGE SCROLLS
===================================================== */

window.addEventListener(
    "scroll",
    function () {

        if (activeMegaMenu) {

            closeMegaMenu();

        }

    }
);