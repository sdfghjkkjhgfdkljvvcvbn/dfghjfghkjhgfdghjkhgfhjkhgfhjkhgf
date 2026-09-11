# Parbati Interior Admin Panel - Requirements Document

## Introduction

The Parbati Interior Admin Panel is a comprehensive content management system designed to empower the Parbati Interior team to manage all aspects of their digital presence. This system will serve as the single source of truth for managing enquiries, marketing content, portfolio projects, service offerings, and brand customization. The admin panel replicates the design and functionality of the Kantipur Studio admin panel while being tailored to interior design business operations in Nepal.

The system prioritizes efficient content management, real-time enquiry handling with WhatsApp integration, and seamless brand customization with live preview capabilities. All content will be persisted in Supabase, with media assets managed through Cloudinary.

---

## Glossary

- **Admin_User**: An authenticated team member with permissions to manage content in the admin panel
- **Enquiry**: A customer inquiry submission containing contact information, service type, project details, and budget preferences
- **Hero_Slider**: The main image carousel displayed on the homepage showcasing key projects and offerings
- **Gallery**: A collection of before/after images, room showcases, and project photography organized by room type or project
- **Project**: A completed interior design project with portfolio details, images/videos, timeline, and client testimonials
- **Service**: An offered service category (e.g., Home Interiors, Modular Kitchen, Construction & WPC Works, Custom Furniture)
- **Service_Page**: A dedicated web page for each service with description, gallery, packages, and FAQ
- **Package**: A tiered offering within a service with pricing, features, and delivery timeline
- **Blog**: Published articles, design tips, industry insights, and case studies for content marketing
- **Theme_Customizer**: A configuration system for managing colors, typography, and visual branding across the site
- **Color_Theme**: A preset color palette (e.g., Terracotta, Walnut, Gold) applied site-wide
- **Font_Theme**: A typographic preset defining heading and body font family and sizing
- **Live_Preview**: Real-time visual representation of theme customization changes before publishing
- **Cloudinary**: Third-party image hosting and optimization service for media assets
- **Supabase**: Backend-as-a-service platform providing authentication, database, and real-time capabilities
- **WhatsApp_Integration**: API connection allowing automated WhatsApp message delivery to admin and customers
- **Dashboard**: The main admin landing page providing overview of key metrics and quick actions
- **Sidebar_Navigation**: Left-hand panel providing access to all admin sections
- **Inbox**: Centralized view of all customer enquiries with filtering and search
- **Enquiry_Detail_Panel**: Dedicated view showing full enquiry information with action buttons

---

## Requirements

### Requirement 1: Admin Authentication & Authorization

**User Story:** As an admin team member, I want to securely authenticate and maintain personalized access, so that my account is protected and I can manage content efficiently.

#### Acceptance Criteria

1. WHEN an admin_user attempts to access the admin_panel, THE Authentication_System SHALL redirect them to a login page
2. WHEN valid credentials are entered (email and password), THE Authentication_System SHALL authenticate via Supabase and create a session
3. WHEN an invalid password is entered, THE Authentication_System SHALL display an error message and prevent access
4. WHEN an admin_user clicks logout, THE Authentication_System SHALL destroy the session and redirect to the login page
5. WHEN a session expires after 30 minutes of inactivity, THE Authentication_System SHALL automatically log out the admin_user
6. WHEN an authenticated admin_user navigates to any protected route, THE Authorization_System SHALL verify their session token
7. IF the session token is invalid or expired, THEN THE Authorization_System SHALL redirect to the login page

---

### Requirement 2: Admin Dashboard & Navigation

**User Story:** As an admin team member, I want a clear overview of key metrics and quick access to all content sections, so that I can efficiently navigate and manage the business.

#### Acceptance Criteria

1. WHEN an authenticated admin_user logs in, THE Dashboard SHALL display a welcome message with their name
2. WHEN the Dashboard loads, THE Dashboard SHALL display key metrics cards showing: total enquiries (monthly), projects published, services active, and recent blog posts
3. WHEN an admin_user views the Sidebar_Navigation, THE Sidebar_Navigation SHALL list all major sections: Dashboard, Enquiries, Hero Slider, Gallery, Projects, Blog, Services, Packages, and Theme Customizer
4. WHEN an admin_user clicks on any section in the Sidebar_Navigation, THE Admin_Panel SHALL navigate to that section and display its interface
5. WHEN an admin_user is on a section page, THE Sidebar_Navigation SHALL highlight the currently active section
6. WHEN the admin_panel is viewed on mobile (screen width < 768px), THE Sidebar_Navigation SHALL collapse into a hamburger menu that can be toggled
7. WHEN an admin_user clicks the main logo, THE Admin_Panel SHALL navigate to the Dashboard

---

### Requirement 3: Enquiry Inbox Management

**User Story:** As an admin team member, I want to receive, view, and respond to customer enquiries in a centralized inbox, so that I can manage customer relationships and sales pipeline.

#### Acceptance Criteria

1. WHEN the admin_user opens the Enquiry section, THE Inbox_List SHALL display all enquiries in a table with columns: customer name, service type, contact date, and status (New, Contacted, In Progress, Closed)
2. WHEN new enquiries arrive from the website, THE Inbox_List SHALL update in real-time and show a badge indicating unread count
3. WHEN an admin_user clicks on an enquiry in the Inbox_List, THE Enquiry_Detail_Panel SHALL open on the right side showing full details: name, email, phone, service type, room type, budget, project description, and timestamp
4. WHEN viewing an Enquiry_Detail_Panel, THE Admin_User SHALL see action buttons: "Mark as Contacted", "Mark as In Progress", "Close Enquiry", and "Send WhatsApp Message"
5. WHEN an admin_user clicks "Send WhatsApp Message", THE WhatsApp_Integration SHALL open a pre-populated message template with customer name and send it via WhatsApp Business API
6. WHEN an admin_user filters by status (e.g., "New"), THE Inbox_List SHALL display only enquiries matching that status
7. WHEN an admin_user searches for a customer by name or email, THE Inbox_List SHALL filter to matching results
8. WHEN an admin_user marks an enquiry as "Closed", THE Enquiry_Status SHALL change and the enquiry SHALL move to the closed section
9. WHEN the admin_user sorts enquiries by date, THE Inbox_List SHALL re-order results in ascending or descending order
10. WHEN an admin_user clicks "Archive Enquiry", THE Enquiry SHALL be moved to an archive section and hidden from active view

---

### Requirement 4: Hero Slider Management

**User Story:** As a marketing team member, I want to manage the homepage hero slider, so that I can showcase featured projects and promotions to website visitors.

#### Acceptance Criteria

1. WHEN the admin_user navigates to the Hero_Slider section, THE Hero_Slider_Editor SHALL display a list of current slides with thumbnail previews
2. WHEN the admin_user clicks "Add New Slide", THE Slide_Form SHALL open with fields for: image/video (via Cloudinary upload), headline text, subheading text, call-to-action button text, and button link destination
3. WHEN an admin_user uploads an image via Cloudinary, THE Cloudinary_Uploader SHALL display upload progress and validate file type (image/video only)
4. WHEN an image is successfully uploaded, THE Slide_Form SHALL display a preview of the uploaded image
5. WHEN the admin_user saves a slide, THE Hero_Slider SHALL persist the slide data to Supabase
6. WHEN an admin_user reorders slides by dragging, THE Hero_Slider_Order SHALL be updated and saved to Supabase
7. WHEN an admin_user clicks "Preview Slide", THE Live_Preview SHALL display the slide as it would appear on the homepage hero section
8. WHEN an admin_user deletes a slide, THE Confirmation_Dialog SHALL ask for confirmation before permanent deletion
9. WHEN a slide is published, THE Hero_Slider_Widget on the live website SHALL automatically update to display the new slide
10. WHERE an image exceeds 5MB, THE Cloudinary_Uploader SHALL reject the upload and display an error message
11. WHEN an admin_user views the slide list, THE Slide_Status SHALL display "Published", "Draft", or "Scheduled" for each slide

---

### Requirement 5: Gallery Management (Before/After & Room Types)

**User Story:** As a content manager, I want to organize and manage gallery images by room type and display before/after transformations, so that I can showcase the company's design work effectively.

#### Acceptance Criteria

1. WHEN the admin_user navigates to the Gallery section, THE Gallery_Editor SHALL display all images organized in tabs by room type: Bedroom, Living Room, Kitchen, Bathroom, Office, Commercial
2. WHEN the admin_user clicks "Add New Image" for a room type, THE Image_Form SHALL open with fields for: image upload, before/after toggle, title, description, project reference, and display order
3. WHEN an admin_user uploads an image, THE Cloudinary_Uploader SHALL persist the image to Cloudinary and generate optimization variants (thumbnail, medium, full-size)
4. WHEN the admin_user enables "Before/After" mode, THE Image_Form SHALL provide a second image upload field for the after image and display a before/after slider in preview
5. WHEN the admin_user saves an image, THE Gallery_Item SHALL be persisted to Supabase with all metadata
6. WHEN an admin_user reorders gallery images by dragging within a room type, THE Display_Order SHALL be updated and saved
7. WHEN an admin_user filters gallery by "Before/After Only", THE Gallery_Editor SHALL display only before/after image pairs
8. WHEN an admin_user deletes a gallery image, THE Confirmation_Dialog SHALL ask for confirmation before deletion from Cloudinary and Supabase
9. WHEN an image is published, THE Gallery_Widget on the live website SHALL automatically display the image in the corresponding room type section
10. WHERE a gallery has images for a room type, THE Gallery_Widget SHALL display a carousel for that room type on the website

---

### Requirement 6: Project/Portfolio Management

**User Story:** As a portfolio manager, I want to create and manage detailed project listings with multimedia content, so that I can showcase completed work and generate business leads.

#### Acceptance Criteria

1. WHEN the admin_user navigates to the Projects section, THE Project_Editor SHALL display a list of all published projects with status badges (Draft, Published, Featured)
2. WHEN the admin_user clicks "Add New Project", THE Project_Form SHALL open with fields for: title, category (Residential, Modular Kitchen, Commercial, Custom Furniture, General Construction), description, media (images/video via Cloudinary), client name, location, completion date, budget range, room types involved, and featured toggle
3. WHEN an admin_user uploads project media via Cloudinary, THE Media_Gallery_Field SHALL allow multiple uploads and create a media carousel
4. WHEN an admin_user selects multiple room types for a project, THE Project_Database SHALL store them and allow filtering by room type on the website
5. WHEN the admin_user enables "Featured", THE Project_Status SHALL be marked as featured and displayed prominently on the Projects page
6. WHEN the admin_user saves a project, THE Project_Metadata (creation date, author, edit history) SHALL be automatically recorded in Supabase
7. WHEN the admin_user creates a project, THE Category_Selector SHALL validate that exactly one category is selected
8. WHEN an admin_user views the Project_List, THE List_Display SHALL support multiple view modes: grid view, list view, and table view
9. WHEN an admin_user filters projects by category or room type, THE Project_List SHALL re-filter and display matching projects
10. WHEN an admin_user publishes a project, THE Project_Detail_Page on the live website SHALL automatically become accessible

---

### Requirement 7: Blog Management

**User Story:** As a content marketer, I want to publish and manage blog articles, design tips, and case studies, so that I can drive organic traffic and establish industry authority.

#### Acceptance Criteria

1. WHEN the admin_user navigates to the Blog section, THE Blog_Editor SHALL display a list of all blog posts with status (Draft, Published, Scheduled), publication date, and view count
2. WHEN the admin_user clicks "Create New Post", THE Blog_Form SHALL open with fields for: title, slug (auto-generated from title), featured image, category (Design Tip, Case Study, Industry Insight, Tutorial), content (rich text editor), excerpt, author, and publication date/time
3. WHEN an admin_user types a title, THE Blog_Form SHALL auto-generate a URL-friendly slug that can be manually edited
4. WHEN the admin_user uses the Rich_Text_Editor for content, THE Editor_Features SHALL support: text formatting (bold, italic, underline), heading levels (H1-H3), bullet lists, numbered lists, image embedding, video embedding, and code blocks
5. WHEN an admin_user embeds an image in blog content, THE Cloudinary_Uploader SHALL upload and optimize the image for web display
6. WHEN the admin_user sets a future publication date, THE Blog_Post_Status SHALL show "Scheduled" and auto-publish at the specified time
7. WHEN the admin_user saves a draft, THE Blog_Post SHALL be persisted to Supabase without being published
8. WHEN the admin_user publishes a post, THE Blog_Post SHALL appear on the Blog page and be indexed for search
9. WHEN an admin_user searches blog posts by title or category, THE Blog_List SHALL filter matching results
10. WHEN an admin_user deletes a published blog post, THE Confirmation_Dialog SHALL warn that the URL will become inactive and ask for confirmation

---

### Requirement 8: Service Management

**User Story:** As a service manager, I want to create and manage service categories and descriptions, so that customers can understand the full range of offerings.

#### Acceptance Criteria

1. WHEN the admin_user navigates to the Services section, THE Service_List SHALL display all services with name, description preview, status (Active, Inactive), and action buttons (Edit, Delete, View Service Page)
2. WHEN the admin_user clicks "Add New Service", THE Service_Form SHALL open with fields for: service name, description (rich text), featured image, icon/emoji, display order, and active toggle
3. WHEN the admin_user uploads a featured image for a service, THE Featured_Image_Preview SHALL display the image at 500px width
4. WHEN the admin_user saves a service, THE Service_Database SHALL persist all data to Supabase
5. WHEN the admin_user reorders services by dragging, THE Display_Order SHALL be updated and services SHALL appear in the new order on the website
6. WHEN the admin_user deactivates a service, THE Service_Visibility SHALL be hidden from the website but remain in the admin database
7. WHEN the admin_user views a service, THE Related_Packages_Panel SHALL display all packages belonging to that service
8. WHEN an admin_user deletes a service with associated packages, THE Confirmation_Dialog SHALL warn of package deletion and require confirmation
9. WHERE a service has no packages, THE Service_Warning SHALL display a message: "No packages defined for this service. Create packages in the Packages section."
10. WHEN the admin_user creates a service, THE Service_Detail_Page on the live website SHALL become accessible at /services/{service-slug}

---

### Requirement 9: Service Pages with Detailed Content

**User Story:** As a service page manager, I want to customize each service's detail page with rich content, FAQ, and galleries, so that customers can make informed decisions.

#### Acceptance Criteria

1. WHEN the admin_user clicks "View Service Page" for a service, THE Service_Page_Editor SHALL display a full-page editor with sections: hero banner, description, benefits/features, gallery carousel, FAQ section, testimonials, and package list
2. WHEN the admin_user edits the service hero banner, THE Hero_Banner_Field SHALL allow image upload and custom headline/subheading text
3. WHEN the admin_user adds items to the benefits section, THE Benefits_List SHALL support rich text formatting for each benefit item
4. WHEN the admin_user uploads images to the Service_Gallery, THE Gallery_Carousel SHALL display the images with zoom and lightbox functionality
5. WHEN the admin_user adds FAQ items, THE FAQ_Form SHALL accept question and answer fields with rich text support
6. WHEN the admin_user clicks "Add Client Testimonial", THE Testimonial_Form SHALL open with fields for: client name, project name, quote, rating (1-5 stars), and client photo
7. WHEN a Service_Page is published, THE Service_Detail_Page on the website SHALL update with all new content
8. WHEN an admin_user previews the Service_Page, THE Live_Preview SHALL display the full page layout before publishing
9. WHERE a service has associated projects, THE Related_Projects_Widget SHALL automatically link and display those projects on the Service_Page
10. WHEN the admin_user enables "Hide Service Page", THE Service_Page SHALL become inaccessible on the website while remaining accessible in admin

---

### Requirement 10: Package Management

**User Story:** As a package curator, I want to create tiered package offerings within services with features and pricing, so that customers can choose appropriate solutions.

#### Acceptance Criteria

1. WHEN the admin_user navigates to the Packages section, THE Package_List SHALL display all packages grouped by service with name, price, feature count, and status
2. WHEN the admin_user clicks "Add New Package", THE Package_Form SHALL open with fields for: service (dropdown), package name, description, price, currency (NPR, USD), features (list), delivery timeline, and active toggle
3. WHEN the admin_user adds features to a package, THE Features_List SHALL allow adding unlimited items, each with a feature description
4. WHEN the admin_user sets a delivery timeline, THE Timeline_Field SHALL accept duration in days with a descriptive label (e.g., "7-14 days")
5. WHEN the admin_user saves a package, THE Package_Database SHALL persist all data to Supabase
6. WHEN an admin_user reorders packages within a service by dragging, THE Package_Order SHALL be updated and maintained on the website
7. WHEN an admin_user deactivates a package, THE Package_Visibility SHALL be hidden from the website
8. WHEN an admin_user creates a package, THE Service_Page_Package_Section SHALL automatically include the new package in the list
9. WHEN the admin_user views the website, THE Package_Comparison_Card SHALL display package details with features highlighted
10. WHERE a package has a price of 0 or empty, THE Package_Warning SHALL display: "Custom pricing. Package will show as 'Contact for pricing' on the website."

---

### Requirement 11: Theme Customizer with Live Preview

**User Story:** As a brand manager, I want to customize the website colors, typography, and visual branding with live preview, so that I can maintain brand consistency and adapt to seasons or promotions.

#### Acceptance Criteria

1. WHEN the admin_user navigates to the Theme_Customizer section, THE Customizer_Interface SHALL display three tabs: Color Themes, Font Themes, and Custom CSS
2. WHEN the admin_user opens the Color_Themes tab, THE Color_Theme_Presets SHALL display 9 predefined themes: Terracotta Brown, Dark Walnut, Antique Gold, Warm Cream, Slate Grey, Forest Green, Ocean Blue, Sunset Orange, and Midnight Black
3. WHEN the admin_user clicks on a Color_Theme_Preset, THE Theme_Configuration SHALL load that preset's color palette with system colors: primary (#8B5E3C for Terracotta), secondary (#C9A84C for Antique Gold), accent (#5C3D1E for Dark Walnut), background (#FBF8F4 for Warm Cream), text, border, and success/warning/error colors
4. WHEN the admin_user clicks "Customize Colors" for a preset, THE Color_Picker_Panel SHALL open allowing modification of each system color with a hex color picker and live preview updates
5. WHEN the admin_user changes a color value, THE Live_Preview_Panel SHALL update all website sections in real-time showing the color change (buttons, headers, links, borders)
6. WHEN the admin_user opens the Font_Themes tab, THE Font_Theme_Presets SHALL display 6 predefined options: Classic (Georgia + Open Sans), Modern (Poppins + Inter), Elegant (Playfair Display + Lato), Bold (Montserrat + Roboto), Minimalist (Quicksand + Work Sans), and Professional (PT Serif + Source Sans Pro)
7. WHEN the admin_user selects a Font_Theme_Preset, THE Font_Configuration SHALL set heading and body fonts and the Live_Preview_Panel SHALL update typography across all website sections
8. WHEN the admin_user clicks "Customize Fonts", THE Font_Picker_Panel SHALL open allowing selection of heading font, body font, and adjustment of base font size (14px-18px) with live preview updates
9. WHEN the admin_user opens the Custom_CSS tab, THE CSS_Editor SHALL display a code editor for adding/modifying custom CSS rules with syntax highlighting
10. WHEN the admin_user modifies custom CSS, THE Live_Preview_Panel SHALL update in real-time reflecting CSS changes
11. WHEN the admin_user clicks "Save Theme", THE Theme_Configuration SHALL be persisted to Supabase and all website pages SHALL update with the new theme
12. WHEN the admin_user clicks "Reset to Default", THE Theme_Configuration SHALL revert to the original Parbati Interior theme colors and fonts
13. WHEN the admin_user clicks "Preview", THE Live_Preview_Panel SHALL open in a modal showing a full-page preview of the website with current theme applied
14. WHERE the Live_Preview_Panel is open, THE Website_Sections_Preview SHALL include sections from: homepage, projects page, services page, blog page, and contact form
15. WHEN the admin_user closes the Live_Preview_Panel, THE Unsaved_Theme_Changes SHALL display a warning if changes have not been saved
16. WHEN a theme is saved, THE Website_Visitor SHALL see the new theme applied within 2 seconds (via CSS cache invalidation)

---

### Requirement 12: Image Upload & Media Management via Cloudinary

**User Story:** As a content creator, I want to upload, optimize, and manage media assets through Cloudinary, so that images load quickly and storage is efficient.

#### Acceptance Criteria

1. WHEN an admin_user uploads an image via any upload field (Hero Slider, Gallery, Projects, Blog, Services), THE Cloudinary_Upload_Widget SHALL display an upload progress bar
2. WHEN an image upload completes, THE System SHALL automatically generate responsive image variants (thumbnail: 300px, medium: 600px, full: 1200px)
3. WHEN an admin_user uploads an image larger than 5MB, THE Upload_Validation SHALL reject the upload and display an error: "Image must be under 5MB"
4. WHEN an admin_user uploads a non-image file (e.g., .txt), THE Upload_Validation SHALL reject it and display: "Only image files (JPG, PNG, WebP) are supported"
5. WHEN an image is successfully uploaded, THE Image_URL_Reference SHALL be stored in Supabase with Cloudinary public_id and display_name
6. WHEN the admin_user deletes an uploaded image from the admin panel, THE Image_Deletion SHALL remove the image from Cloudinary and the Supabase reference
7. WHEN an admin_user views the Media_Library (if available), THE Media_Gallery SHALL display all uploaded images with metadata: upload date, size, dimensions, and Cloudinary URL
8. WHEN an image is displayed on the website, THE Cloudinary_CDN SHALL serve the optimized variant based on device screen size
9. WHERE an image upload fails due to network issues, THE Upload_Retry_Logic SHALL automatically attempt to re-upload with exponential backoff
10. WHEN the admin_user searches the media library by filename, THE Media_Gallery SHALL filter matching results

---

### Requirement 13: Real-Time Enquiry Notifications

**User Story:** As an admin team member, I want to receive real-time notifications for new enquiries, so that I can respond quickly to customer interest.

#### Acceptance Criteria

1. WHEN a new enquiry is submitted on the website, THE Enquiry_Event_Listener SHALL capture the submission in real-time
2. WHEN a new enquiry is detected, THE Admin_User (if logged in) SHALL receive a browser notification with customer name, service type, and phone number
3. WHEN a new enquiry arrives, THE Enquiry_Count_Badge in the Sidebar_Navigation SHALL increment showing "Enquiries (n new)"
4. WHEN an admin_user receives an enquiry notification, THE Audio_Alert SHALL play a subtle notification sound (if enabled in settings)
5. WHERE an admin_user has opted in to email notifications in their settings, THE Email_Notification SHALL send an email with enquiry details within 5 minutes of submission
6. WHEN an admin_user clicks a notification, THE Admin_Panel SHALL navigate directly to the new enquiry in the Inbox
7. WHEN the admin_user refreshes the page, THE Unread_Enquiry_Count SHALL be recalculated from Supabase to ensure accuracy
8. WHERE multiple admin_users are logged in, THE Real_Time_Sync SHALL ensure all users see enquiry updates simultaneously via Supabase real-time subscriptions

---

### Requirement 14: Content Versioning & Change History

**User Story:** As a content manager, I want to track changes to content and restore previous versions if needed, so that I can maintain editorial control and recover from accidental deletions.

#### Acceptance Criteria

1. WHEN an admin_user creates or edits any content item (project, blog post, service, package), THE Change_History SHALL automatically record: timestamp, admin_user name, action type (created/edited/deleted), and changed fields
2. WHEN an admin_user views the Change_History for a content item, THE Version_Panel SHALL display a chronological list of all versions with dates, editors, and a summary of changes
3. WHEN an admin_user clicks on a previous version, THE Version_Diff_Viewer SHALL highlight the differences between the current and previous version
4. WHEN an admin_user clicks "Restore to This Version", THE Content_Restoration SHALL revert the item to the selected version and create a new version entry recording the restoration
5. WHEN a version is restored, THE Admin_User SHALL receive a confirmation message showing what was changed
6. WHERE a content item has been deleted, THE Deleted_Items_Archive SHALL maintain the full content history for 30 days before permanent deletion
7. WHEN an admin_user views the Change_History, THE History_Retention_Policy SHALL show all versions for the current item

---

### Requirement 15: Batch Operations & Bulk Management

**User Story:** As an admin, I want to perform batch operations on multiple items, so that I can manage content efficiently at scale.

#### Acceptance Criteria

1. WHEN the admin_user views any list (Projects, Blog, Services, Gallery images), THE Bulk_Selection_Checkbox SHALL appear at the top of the list allowing selection of multiple items
2. WHEN an admin_user selects multiple items, THE Bulk_Action_Menu SHALL appear with options: Publish, Archive, Delete, and (for projects) Mark as Featured
3. WHEN an admin_user clicks "Publish" on selected items, THE Batch_Publish_Operation SHALL publish all selected items simultaneously and display a success message with count
4. WHEN an admin_user clicks "Delete" on selected items, THE Batch_Delete_Confirmation SHALL ask for confirmation showing the count of items to be deleted
5. WHEN batch deletion is confirmed, THE Batch_Delete_Operation SHALL delete all selected items from Supabase and associated Cloudinary images
6. WHEN a batch operation completes, THE Operation_Status_Message SHALL display success or failure with count of affected items
7. WHERE batch operations affect published website content, THE Cache_Invalidation SHALL ensure website updates within 2 seconds

---

### Requirement 16: Admin User Roles & Permissions

**User Story:** As an admin manager, I want to assign different permission levels to team members, so that content responsibilities are distributed securely.

#### Acceptance Criteria

1. WHEN the admin_user navigates to Settings > Users (if permission granted), THE User_Management_Panel SHALL display all admin users with email, role, and status
2. WHEN an admin_user clicks "Add User", THE User_Invitation_Form SHALL accept an email address and allow selection of role: Admin (full access), Content_Editor (edit content sections), Enquiry_Manager (access Enquiries section only), or Viewer (read-only access)
3. WHEN a role is selected, THE Permission_Display SHALL show which sections and actions the role can access
4. WHEN a new user is invited, THE Invitation_Email SHALL be sent containing a secure link to set their password
5. WHEN the invited user clicks the link and sets their password, THE User_Account_Activation SHALL activate their account with the assigned role
6. WHEN an admin_user edits another user's role, THE Role_Update_Confirmation SHALL ask for confirmation and log the change
7. WHERE a user's role is changed to "Viewer", THE User_Permissions SHALL be immediately restricted to read-only access across all sections
8. WHEN an admin_user disables a user account, THE User_Access SHALL be revoked and the user SHALL not be able to log in
9. WHEN a user account is disabled, THE Audit_Log SHALL record the action with timestamp and admin name

---

### Requirement 17: Search & Filter Functionality

**User Story:** As an admin user, I want to search and filter content across sections, so that I can quickly find and manage specific items.

#### Acceptance Criteria

1. WHEN the admin_user is viewing any list (Projects, Blog, Services, Gallery, Enquiries), THE Search_Bar SHALL accept text input and search across relevant fields (title, description, category, customer name)
2. WHEN the admin_user types in the Search_Bar, THE Search_Results SHALL update dynamically showing matching items (with debounce of 300ms)
3. WHEN the admin_user applies a filter (e.g., Category, Status, Date Range), THE Filtered_Results SHALL display only items matching the filter criteria
4. WHEN multiple filters are applied, THE Combined_Filter_Logic SHALL apply AND logic (all filters must match)
5. WHEN the admin_user clicks "Clear Filters", THE Filter_State SHALL reset and the full list SHALL be displayed
6. WHEN an admin_user saves a custom filter combination, THE Saved_Filter SHALL be stored and available for quick access
7. WHEN the admin_user searches or filters, THE Result_Count_Display SHALL show the number of matching items and total available

---

### Requirement 18: Export & Reporting

**User Story:** As an admin, I want to export data and generate reports, so that I can analyze business metrics and share insights.

#### Acceptance Criteria

1. WHEN an admin_user views the Enquiries section, THE Export_Button SHALL allow exporting enquiry data to CSV format with columns: customer name, email, phone, service type, budget, submission date, status
2. WHEN the admin_user clicks "Export Enquiries", THE CSV_Export SHALL generate a file named "enquiries_{date}.csv" and trigger download
3. WHEN an admin_user exports data, THE Exported_Data SHALL include only non-sensitive information (no admin notes or internal flags)
4. WHEN the admin_user views Projects or Blog sections, THE Export_Options SHALL include export to CSV with relevant columns
5. WHEN the admin_user exports enquiry data, THE Export_Confirmation SHALL display: number of records, file size, and download status

---

### Requirement 19: Email & WhatsApp Integration for Enquiries

**User Story:** As an enquiry manager, I want to communicate with customers via email and WhatsApp directly from the admin panel, so that I can maintain relationships without leaving the platform.

#### Acceptance Criteria

1. WHEN an admin_user views an enquiry detail, THE Communication_Panel SHALL display buttons: "Send Email", "Send WhatsApp", and "Call" (if phone integration available)
2. WHEN the admin_user clicks "Send Email", THE Email_Composer SHALL open with a template pre-filled with customer name and editable message body
3. WHEN the admin_user composes and sends an email, THE Email_Service SHALL send via the configured email provider and log the communication timestamp and content in Supabase
4. WHEN the admin_user clicks "Send WhatsApp Message", THE WhatsApp_Composer SHALL open with a pre-filled template: "Hi {customer_name}, Thank you for your interest in Parbati Interior's {service_type}. We'd like to discuss your project. Can we call you tomorrow?"
5. WHEN the admin_user edits the WhatsApp message and clicks "Send", THE WhatsApp_Integration SHALL send the message via WhatsApp Business API and log the communication
6. WHEN an email or WhatsApp is sent, THE Communication_Log SHALL display the message timestamp, status (Sent/Failed/Pending), and method used
7. WHERE an email or WhatsApp fails to send, THE Delivery_Status SHALL display "Failed" with a retry button
8. WHEN an enquiry receives communication (email or WhatsApp), THE Enquiry_Status SHALL automatically update to "Contacted" if it was "New"
9. WHEN the admin_user views the enquiry timeline, THE Activity_Timeline SHALL display all communications in chronological order

---

### Requirement 20: Audit Logging & Admin Activity Tracking

**User Story:** As a compliance officer, I want to audit all admin actions for accountability and security, so that I can ensure data integrity and track who made changes.

#### Acceptance Criteria

1. WHEN an admin_user performs any action (create, edit, delete, publish, unpublish), THE Audit_Log SHALL record: timestamp, admin_user name/email, action type, affected content item (title/ID), and old/new values for edited fields
2. WHEN the admin_user navigates to Settings > Audit Log (if permission granted), THE Audit_Log_Viewer SHALL display all logged actions in reverse chronological order with filtering by date range, admin_user, and action type
3. WHEN an admin_user views the Audit_Log, THE Exportable_Audit_Report SHALL allow exporting log entries to CSV for compliance purposes
4. WHEN a sensitive action occurs (user role change, theme publication, enquiry deletion), THE Sensitive_Action_Alert SHALL log with higher detail and send an optional notification to the primary admin
5. WHERE audit logs accumulate over time, THE Log_Retention_Policy SHALL maintain logs for 90 days before archival

---

### Requirement 21: Performance & Load Time

**User Story:** As a user, I want the admin panel to load and respond quickly, so that I can work efficiently without frustration.

#### Acceptance Criteria

1. WHEN the admin_user navigates to a section, THE Initial_Load_Time SHALL be under 2 seconds for all pages (measured on standard internet connection)
2. WHEN the admin_user scrolls through large lists (100+ items), THE Virtualization_Rendering SHALL display only visible items to maintain smooth scrolling performance
3. WHEN the admin_user searches or filters a large dataset, THE Search_Response_Time SHALL update results within 500ms
4. WHEN the admin_user uploads a large image (5MB), THE Upload_Feedback SHALL show real-time progress bar updating at least every 500ms
5. WHERE the Live_Preview_Panel is active, THE Preview_Update_Latency SHALL reflect theme changes within 300ms

---

### Requirement 22: Mobile Responsiveness for Admin Panel

**User Story:** As a mobile user, I want the admin panel to work on tablets and phones, so that I can manage content remotely.

#### Acceptance Criteria

1. WHEN the admin_panel is viewed on a tablet (768px - 1024px), THE Layout_Adaptation SHALL adjust the sidebar to a collapsible menu and stack sections appropriately
2. WHEN the admin_panel is viewed on a mobile phone (< 768px), THE Mobile_Layout SHALL display: hamburger menu for navigation, full-width content sections, and stacked forms
3. WHEN the admin_user taps a form field on mobile, THE Mobile_Keyboard SHALL display appropriately (numeric for phone fields, email for email fields)
4. WHEN the admin_user uploads an image on mobile, THE Mobile_Upload_Handler SHALL allow camera capture or gallery selection
5. WHEN the admin_user views the Enquiry_Detail_Panel on mobile, THE Panel_Behavior SHALL slide in from the bottom as a modal or full-screen overlay
6. WHEN the admin_panel is viewed on a screen < 768px, THE Touch_Targets SHALL be at least 44px × 44px for accessibility

---

## Appendix: Technical Requirements Summary

### Backend Infrastructure
- **Database**: Supabase PostgreSQL with real-time subscriptions
- **Authentication**: Supabase Auth with JWT tokens
- **File Storage**: Cloudinary for image hosting and optimization
- **Messaging**: WhatsApp Business API integration
- **Email**: Email service provider (SendGrid, Mailgun, or similar)

### Frontend Stack
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom brand color system
- **UI Components**: Lucide React icons, custom components
- **State Management**: React hooks with Supabase real-time subscriptions
- **Routing**: React Router v7+

### Supported Features
- Real-time updates via Supabase
- Responsive design (mobile, tablet, desktop)
- Image optimization via Cloudinary CDN
- Batch operations
- Change history and versioning
- Audit logging
- Role-based access control

---

**Document Version**: 1.0  
**Date Created**: January 2025  
**Status**: Ready for Review
