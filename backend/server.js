const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;


/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
    cors({
        origin: true,
        credentials: true
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/* =========================================================
   MYSQL
========================================================= */

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "jesper_db",

   ssl:
  process.env.DB_SSL === "true"
    ? {
        ca: process.env.DB_CA_CERT
          ? Buffer.from(process.env.DB_CA_CERT, "base64").toString("utf8")
          : undefined,
        rejectUnauthorized: true,
      }
    : undefined,


    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


/* =========================================================
   EMAIL
========================================================= */

const mailTransporter =
    nodemailer.createTransport({
        service: "gmail",

        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_APP_PASSWORD
        }
    });


function formatEnquiryType(type) {

    const types = {
        product: "Product Enquiry",
        distribution: "Distribution Requirement",
        partnership: "Business Partnership",
        general: "General Enquiry"
    };

    return types[type] || type;
}


/* =========================================================
   CUSTOMER ACKNOWLEDGEMENT
========================================================= */

async function sendCustomerAcknowledgement(enquiry) {

    await mailTransporter.sendMail({

        from:
            `"Jesper Pharma" <${process.env.MAIL_USER}>`,

        to:
            enquiry.email,

        subject:
            "We Received Your Enquiry | Jesper Pharma",

        text:
`Dear ${enquiry.full_name},

Thank you for contacting Jesper Pharma.

We have successfully received your enquiry.

Enquiry Type:
${formatEnquiryType(enquiry.enquiry_type)}

Our team will review your requirement and contact you shortly.

If you need to provide additional information, you may reply directly to this email.

Regards,
Jesper Pharma
Serves Health

Phone: +91 7032102726
Email: ${process.env.MAIL_USER}`

    });

}


/* =========================================================
   ADMIN NEW ENQUIRY NOTIFICATION
========================================================= */

async function sendAdminNotification(
    enquiry,
    enquiryId
) {

    await mailTransporter.sendMail({

        from:
            `"Jesper Website" <${process.env.MAIL_USER}>`,

        to:
            process.env.ADMIN_NOTIFICATION_EMAIL,

        subject:
            `New Jesper Website Enquiry #${enquiryId}`,

        text:
`A new enquiry has been submitted through the Jesper Pharma website.

Enquiry ID:
#${enquiryId}

Customer:
${enquiry.full_name}

Phone:
${enquiry.phone}

Email:
${enquiry.email}

Company / Pharmacy:
${enquiry.company || "Not provided"}

Enquiry Type:
${formatEnquiryType(enquiry.enquiry_type)}

Message:
${enquiry.message}

Status:
New

Please login to the Jesper Pharma Admin Dashboard to manage this enquiry.`

    });

}


/* =========================================================
   ADMIN CONTACT CUSTOMER EMAIL
========================================================= */

async function sendAdminContactEmail(enquiry) {

    await mailTransporter.sendMail({

        from:
            `"Jesper Pharma" <${process.env.MAIL_USER}>`,

        to:
            enquiry.email,

        replyTo:
            process.env.MAIL_USER,

        subject:
            `Regarding Your ${formatEnquiryType(
                enquiry.enquiry_type
            )} | Jesper Pharma`,

        text:
`Dear ${enquiry.full_name},

Greetings from Jesper Pharma.

Our team has reviewed your enquiry regarding:

${formatEnquiryType(enquiry.enquiry_type)}

Thank you for reaching out to us.

We are contacting you regarding your requirement and will be happy to assist you with the relevant product, distribution or business information.

Your submitted message:

"${enquiry.message}"

If you would like to provide any additional details, please reply directly to this email.

Regards,
Jesper Pharma
Serves Health

Phone: +91 7032102726
Email: ${process.env.MAIL_USER}`

    });

}


/* =========================================================
   ADMIN SESSION
========================================================= */

const adminTokens = new Set();


function requireAdmin(req, res, next) {

    const authorization =
        req.headers.authorization || "";


    if (!authorization.startsWith("Bearer ")) {

        return res.status(401).json({
            success: false,
            message: "Admin authorization required."
        });

    }


    const token =
        authorization.substring(7).trim();


    if (!token || !adminTokens.has(token)) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired admin session."
        });

    }


    next();
}


/* =========================================================
   SERVER TEST
========================================================= */

app.get("/", function (req, res) {

    res.json({
        success: true,
        message: "Jesper Pharma Backend is Running"
    });

});


/* =========================================================
   HEALTH
========================================================= */

app.get("/api/health", async function (req, res) {

    try {

        await pool.query("SELECT 1");

        res.json({
            success: true,
            database: "Connected",
            email:
                process.env.MAIL_USER
                    ? "Configured"
                    : "Not Configured"
        });

    }
    catch (error) {

        res.status(500).json({
            success: false,
            database: "Disconnected"
        });

    }

});


/* =========================================================
   CREATE ENQUIRY
========================================================= */

app.post("/api/enquiries", async function (req, res) {

    try {

        let {
            full_name,
            phone,
            email,
            company,
            enquiry_type,
            message
        } = req.body;


        full_name =
            typeof full_name === "string"
                ? full_name.trim()
                : "";

        phone =
            typeof phone === "string"
                ? phone.replace(/\D/g, "")
                : "";

        email =
            typeof email === "string"
                ? email.trim().toLowerCase()
                : "";

        company =
            typeof company === "string"
                ? company.trim()
                : "";

        enquiry_type =
            typeof enquiry_type === "string"
                ? enquiry_type.trim()
                : "";

        message =
            typeof message === "string"
                ? message.trim()
                : "";


        if (!full_name) {

            return res.status(400).json({
                success: false,
                message: "Full name is required."
            });

        }


        if (!/^[6-9][0-9]{9}$/.test(phone)) {

            return res.status(400).json({
                success: false,
                message:
                    "Enter a valid 10-digit mobile number."
            });

        }


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(email)) {

            return res.status(400).json({
                success: false,
                message:
                    "Enter a valid email address."
            });

        }


        const allowedTypes = [
            "product",
            "distribution",
            "partnership",
            "general"
        ];


        if (
            !allowedTypes.includes(
                enquiry_type
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Select a valid enquiry type."
            });

        }


        if (message.length < 10) {

            return res.status(400).json({
                success: false,
                message:
                    "Please provide more information."
            });

        }


        const [result] =
            await pool.execute(
                `
                INSERT INTO enquiries
                (
                    full_name,
                    phone,
                    email,
                    company,
                    enquiry_type,
                    message
                )
                VALUES (?, ?, ?, ?, ?, ?)
                `,
                [
                    full_name,
                    phone,
                    email,
                    company || null,
                    enquiry_type,
                    message
                ]
            );


        const enquiryId =
            result.insertId;


        const enquiry = {
            full_name,
            phone,
            email,
            company,
            enquiry_type,
            message
        };


        /*
            Enquiry DB save should remain successful
            even if an email temporarily fails.
        */

        const mailResults =
            await Promise.allSettled([

                sendCustomerAcknowledgement(
                    enquiry
                ),

                sendAdminNotification(
                    enquiry,
                    enquiryId
                )

            ]);


        mailResults.forEach(
            function (result, index) {

                if (
                    result.status ===
                    "rejected"
                ) {

                    console.error(
                        index === 0
                            ? "Customer acknowledgement failed:"
                            : "Admin notification failed:",
                        result.reason
                    );

                }

            }
        );


        res.status(201).json({
            success: true,

            message:
                "Thank you. Your enquiry has been submitted successfully.",

            enquiry_id:
                enquiryId
        });

    }
    catch (error) {

        console.error(
            "Create enquiry error:",
            error
        );


        res.status(500).json({
            success: false,
            message:
                "Unable to submit your enquiry right now."
        });

    }

});


/* =========================================================
   ADMIN LOGIN
========================================================= */

app.post("/api/admin/login", function (req, res) {

    const {
        email,
        password
    } = req.body;


    const adminEmail =
        process.env.ADMIN_EMAIL;

    const adminPassword =
        process.env.ADMIN_PASSWORD;


    const enteredEmail =
        typeof email === "string"
            ? email.trim().toLowerCase()
            : "";

    const enteredPassword =
        typeof password === "string"
            ? password
            : "";


    if (
        !adminEmail ||
        !adminPassword
    ) {

        return res.status(500).json({
            success: false,
            message:
                "Admin credentials are not configured."
        });

    }


    if (
        enteredEmail !==
            adminEmail.trim().toLowerCase() ||
        enteredPassword !==
            adminPassword
    ) {

        return res.status(401).json({
            success: false,
            message:
                "Invalid admin email or password."
        });

    }


    const token =
        crypto.randomUUID();


    adminTokens.add(token);


    res.json({
        success: true,
        message:
            "Admin login successful.",
        token
    });

});


/* =========================================================
   ADMIN LOGOUT
========================================================= */

app.post(
    "/api/admin/logout",
    requireAdmin,
    function (req, res) {

        const token =
            req.headers.authorization
                .substring(7)
                .trim();


        adminTokens.delete(token);


        res.json({
            success: true,
            message:
                "Admin logged out successfully."
        });

    }
);


/* =========================================================
   GET ENQUIRIES
========================================================= */

app.get(
    "/api/admin/enquiries",
    requireAdmin,
    async function (req, res) {

        try {

            const [rows] =
                await pool.query(`
                    SELECT
                        id,
                        full_name,
                        phone,
                        email,
                        company,
                        enquiry_type,
                        message,
                        status,
                        created_at
                    FROM enquiries
                    ORDER BY created_at DESC
                `);


            res.json({
                success: true,
                enquiries: rows
            });

        }
        catch (error) {

            console.error(
                "Load enquiries error:",
                error
            );


            res.status(500).json({
                success: false,
                message:
                    "Unable to load enquiries."
            });

        }

    }
);


/* =========================================================
   CONTACT CUSTOMER

   Sends email and automatically marks Contacted.
========================================================= */

app.post(
    "/api/admin/enquiries/:id/contact",
    requireAdmin,
    async function (req, res) {

        try {

            const enquiryId =
                Number(req.params.id);


            if (
                !Number.isInteger(
                    enquiryId
                ) ||
                enquiryId <= 0
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid enquiry ID."
                });

            }


            /*
                Get customer enquiry
            */

            const [rows] =
                await pool.execute(
                    `
                    SELECT
                        id,
                        full_name,
                        phone,
                        email,
                        company,
                        enquiry_type,
                        message,
                        status,
                        created_at
                    FROM enquiries
                    WHERE id = ?
                    `,
                    [enquiryId]
                );


            if (rows.length === 0) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Enquiry not found."
                });

            }


            const enquiry =
                rows[0];


            /*
                Send email first.
                If email fails, status will NOT change.
            */

            await sendAdminContactEmail(
                enquiry
            );


            /*
                Email sent successfully.
                Mark enquiry as Contacted.
            */

            await pool.execute(
                `
                UPDATE enquiries
                SET status = 'Contacted'
                WHERE id = ?
                `,
                [enquiryId]
            );


            res.json({
                success: true,

                message:
                    `Email sent successfully to ${enquiry.full_name}.`,

                status:
                    "Contacted"
            });

        }
        catch (error) {

            console.error(
                "Contact customer error:",
                error
            );


            res.status(500).json({
                success: false,

                message:
                    "Unable to send email to customer."
            });

        }

    }
);


/* =========================================================
   UPDATE STATUS
========================================================= */

app.patch(
    "/api/admin/enquiries/:id/status",
    requireAdmin,
    async function (req, res) {

        try {

            const enquiryId =
                Number(req.params.id);

            const {
                status
            } = req.body;


            const allowedStatuses = [
                "New",
                "Contacted",
                "Closed"
            ];


            if (
                !Number.isInteger(
                    enquiryId
                ) ||
                enquiryId <= 0
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid enquiry ID."
                });

            }


            if (
                !allowedStatuses.includes(
                    status
                )
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid enquiry status."
                });

            }


            const [result] =
                await pool.execute(
                    `
                    UPDATE enquiries
                    SET status = ?
                    WHERE id = ?
                    `,
                    [
                        status,
                        enquiryId
                    ]
                );


            if (
                result.affectedRows === 0
            ) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Enquiry not found."
                });

            }


            res.json({
                success: true,
                message:
                    "Enquiry status updated successfully."
            });

        }
        catch (error) {

            console.error(
                "Status update error:",
                error
            );


            res.status(500).json({
                success: false,
                message:
                    "Unable to update enquiry status."
            });

        }

    }
);


/* =========================================================
   DELETE ENQUIRY
========================================================= */

app.delete(
    "/api/admin/enquiries/:id",
    requireAdmin,
    async function (req, res) {

        try {

            const enquiryId =
                Number(req.params.id);


            if (
                !Number.isInteger(
                    enquiryId
                ) ||
                enquiryId <= 0
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid enquiry ID."
                });

            }


            const [result] =
                await pool.execute(
                    `
                    DELETE FROM enquiries
                    WHERE id = ?
                    `,
                    [enquiryId]
                );


            if (
                result.affectedRows === 0
            ) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Enquiry not found."
                });

            }


            res.json({
                success: true,
                message:
                    "Enquiry deleted successfully."
            });

        }
        catch (error) {

            console.error(
                "Delete enquiry error:",
                error
            );


            res.status(500).json({
                success: false,
                message:
                    "Unable to delete enquiry."
            });

        }

    }
);


/* =========================================================
   API 404
========================================================= */

app.use(
    "/api",
    function (req, res) {

        res.status(404).json({
            success: false,
            message:
                "API endpoint not found."
        });

    }
);


/* =========================================================
   START
========================================================= */

async function startServer() {

    try {

        const connection =
            await pool.getConnection();


        console.log(
            "Connected to MySQL database"
        );


        connection.release();


        try {

            await mailTransporter.verify();

            console.log(
                "Email automation connected"
            );

        }
        catch (error) {

            console.error(
                "Email automation connection failed:"
            );

            console.error(
                error.message
            );

        }


        app.listen(
            PORT,
            function () {

                console.log(
                    `Server running on http://localhost:${PORT}`
                );

            }
        );

    }
    catch (error) {

        console.error(
            "Unable to connect to MySQL:"
        );

        console.error(
            error.message
        );

        process.exit(1);

    }

}


startServer();