import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SCENE = { width: 88, height: 101 };
const DB_TABLE_CHAPES = "chapse";
const DB_TABLE_USERS = "users";
const DB_TABLE_EXPORT_EVENTS = "export_events";
const USER_ROLES = ["admin", "user"];
const STORAGE_UI_LANG = "chapse_ui_lang";
const ADMIN_EMAIL = "mparrino@chapsvision.com";
const ADMIN_PROFILE_DEFAULTS = {
  nom: "Parrino",
  prenom: "Mathieu",
  role: "admin",
};

const SKINS = ["light", "dark"];
const LEFT_ARM_VARIANTS = [
  "rest_open_down_front",
  "hold_grip_down_in",
  "hold_grip_down_side",
  "wave_point_up_side",
  "hold_fist_up_side",
  "rest_open_down_side",
  "rest_open_down_in",
  "wave_open_up_side",
];
const RIGHT_ARM_VARIANTS = [
  "rest_open_down_front",
  "hold_grip_down_in",
  "hold_grip_down_side",
  "wave_point_up_side",
  "hold_fist_up_side",
  "rest_open_down_side",
  "rest_open_down_in",
  "wave_open_up_side",
];
const EYE_EXPRESSIONS = ["default", "happy", "wink", "loading", "error", "stars", "love"];
const HEAD_INCLINATIONS = ["default", "tilted"];

const PRESET_EXAMPLE_1 = {
  skin: "light",
  leftArm: "rest_open_down_side",
  rightArm: "rest_open_down_side",
  eyes: "default",
  head: "default",
  shadowEnabled: true,
};

const PRESET_EXAMPLE_2 = {
  skin: "light",
  leftArm: "rest_open_down_in",
  rightArm: "hold_grip_down_in",
  eyes: "love",
  head: "default",
  shadowEnabled: true,
};

const PRESET_EXAMPLE_3 = {
  skin: "light",
  leftArm: "wave_open_up_side",
  rightArm: "wave_open_up_side",
  eyes: "stars",
  head: "default",
  shadowEnabled: true,
};

const GUIDE_CASES = [
  {
    id: "light-dark",
    titleKey: "guide_case_1_title",
    introTitleKey: "guide_case_1_intro_title",
    introLines: ["guide_case_1_intro_line_1", "guide_case_1_intro_line_2"],
    items: [
      { skin: "light", surface: "light", isDo: true },
      { skin: "dark", surface: "light", isDo: false },
      { skin: "dark", surface: "dark", isDo: true },
      { skin: "light", surface: "dark", isDo: false },
    ],
  },
  {
    id: "official-assets",
    titleKey: "guide_case_2_title",
    introTitleKey: "guide_case_2_intro_title",
    introLines: ["guide_case_2_intro_line_1"],
    items: [
      { type: "robot", skin: "light", surface: "light", isDo: true },
      {
        type: "asset",
        assetPath: "assets/dont/custom1.svg",
        surface: "light",
        isDo: false,
      },
      { type: "asset", assetPath: "assets/dont/fat.svg", surface: "light", isDo: false },
      { type: "asset", assetPath: "assets/dont/pink.svg", surface: "light", isDo: false },
    ],
  },
];

const I18N = {
  en: {
    app_title: "Chaps-e Generator by ChapsVision",
    login_title: "Sign in",
    login_subtitle: "Internal ChapsVision account",
    login_email_placeholder: "name@company.com",
    login_password_placeholder: "Enter your password",
    login_password: "Password",
    login_submit: "Sign in",
    login_error_missing_config:
      "Supabase config missing: fill config.js to enable login and cloud library.",
    login_error_restore_session: "Unable to restore session.",
    login_error_supabase: "Supabase not configured.",
    login_error_required: "Email and password are required.",
    login_error_failed: "Sign in failed: {message}",
    login_error_invalid_credentials_help:
      "Invalid login credentials. Create this user in Supabase Auth > Users with email mparrino@chapsvision.com and password admin, then retry.",
    login_error_signed_out: "Sign out failed: {message}",
    save_title: "Name your Chap-e",
    save_subtitle: "This name will be used in your library.",
    save_name_label: "Chap-e name",
    save_name_placeholder: "e.g. Support Mascot",
    save_cancel: "Cancel",
    save_confirm: "Save",
    save_name_required: "Name is required.",
    save_error_failed: "Save failed: {message}",
    save_error_supabase: "Supabase not configured.",
    save_error_connect: "Sign in to save.",
    save_error_missing_config: "Supabase not configured. Cannot save to library.",
    nav_generator: "Generator",
    nav_guide: "Guide",
    nav_my_chaps: "My library",
    profile_not_connected: "Not connected",
    profile_connected: "Connected: {email}",
    role_label: "{role}",
    role_admin: "Admin",
    role_user: "User",
    language_toggle: "Passe en 🇫🇷 Français",
    password_btn: "Change password",
    password_modal_title: "Change password",
    password_modal_subtitle: "Set your new account password.",
    password_new_label: "New password",
    password_confirm_label: "Confirm password",
    password_new_placeholder: "Enter new password",
    password_confirm_placeholder: "Confirm new password",
    password_modal_cancel: "Cancel",
    password_modal_confirm: "Update password",
    password_success: "Password updated.",
    password_error_required: "Both password fields are required.",
    password_error_mismatch: "Passwords do not match.",
    password_error_too_short: "Password must be at least 6 characters.",
    password_error: "Password reset failed: {message}",
    create_user_btn: "Create user",
    create_user_modal_title: "Create user",
    create_user_modal_subtitle: "Create a new active account.",
    create_user_email_label: "Email",
    create_user_email_placeholder: "name@company.com",
    create_user_password_label: "Password",
    create_user_password_placeholder: "Minimum 6 characters",
    create_user_confirm_label: "Confirm password",
    create_user_confirm_placeholder: "Confirm password",
    create_user_nom_label: "Last name",
    create_user_nom_placeholder: "Doe",
    create_user_prenom_label: "First name",
    create_user_prenom_placeholder: "John",
    create_user_role_label: "Role",
    create_user_role_user: "User",
    create_user_role_admin: "Admin",
    create_user_cancel: "Cancel",
    create_user_confirm: "Create user",
    create_user_success: "User created and active.",
    create_user_error_not_admin: "Only admin can create users.",
    create_user_error_required: "All fields are required.",
    create_user_error_email_invalid: "Invalid email.",
    create_user_error_password_short: "Password must be at least 6 characters.",
    create_user_error_password_mismatch: "Passwords do not match.",
    create_user_error_supabase: "Supabase not configured.",
    create_user_error_connect: "Sign in first.",
    create_user_error_email_exists: "This email already exists.",
    create_user_error_edge_unreachable:
      "Unable to reach the Edge Function. Deploy `admin-create-user` on Supabase (Edge Functions) and check CORS.",
    create_user_error_failed: "Create user failed: {message}",
    stats_btn: "Admin stats",
    stats_title: "Admin stats",
    stats_subtitle: "Stats across all users.",
    stats_total_saved: "Saved in library",
    stats_exports_png: "PNG exports",
    stats_exports_jpg: "JPG exports",
    stats_loading: "Loading stats...",
    stats_error_supabase: "Supabase not configured.",
    stats_error_connect: "Sign in first.",
    stats_error_not_admin: "Only admin can access stats.",
    stats_error_edge_unreachable:
      "Unable to reach the Edge Function. Deploy `admin-stats` on Supabase (Edge Functions) and check CORS.",
    stats_error_failed: "Unable to load stats: {message}",
    logout_btn: "Sign out",
    panel_title: "Configuration",
    picker_left_arm: "Left arm",
    picker_right_arm: "Right arm",
    picker_eyes: "Eyes",
    picker_head: "Head",
    shadow_label: "Show shadow",
    preset_1: "Preset Example 1",
    preset_2: "Preset Example 2",
    preset_3: "Preset Example 3",
    save_trigger: "Save",
    save_as_svg: "Export as SVG",
    save_as_png: "Export as PNG",
    save_as_jpg: "Export as JPG",
    save_to_library: "Save to My Library",
    mychaps_title: "My library",
    mychaps_subtitle: "Your saved Chap-e for your account.",
    guide_prev: "Previous",
    guide_next: "Next",
    guide_title: "Usage guide",
    guide_subtitle: "Do and don't rules for using Chaps-e.",
    guide_case_1_title: "Rule #1: Light / Dark selection",
    guide_case_1_intro_title: "Application:",
    guide_case_1_intro_line_1: "Light Chaps-e: only on light background",
    guide_case_1_intro_line_2: "Dark Chaps-e: only on dark background",
    guide_case_2_title: "Rule #2: Use official assets",
    guide_case_2_intro_title: "Chaps-e must be assembled using official Figma components:",
    guide_case_2_intro_line_1: "Forbidden: redraw, edit proportions, stretch, recolor...",
    guide_examples_label: "Example",
    guide_do: "Do",
    guide_dont: "Don't",
    preview_label: "Robot preview",
    loading_assets: "Loading assets...",
    loading_error: "Error",
    assets_incomplete: "Incomplete assets.",
    export_png_failed: "PNG export failed.",
    export_jpg_failed: "JPG export failed.",
    library_missing_config:
      "Supabase is not configured. Fill config.js to enable login and your cloud library.",
    library_not_connected: "Sign in to view and save your library.",
    library_empty: "No Chap-e in your library yet.",
    library_load_error: "Load error: {message}",
    library_date_unknown: "Unknown date",
    library_created_on: "Created on {date}",
    library_use: "Use",
    library_delete: "Delete",
    library_delete_error: "Delete failed: {message}",
    save_default_name_prefix: "Chap-e",
    label_light: "Light",
    label_dark: "Dark",
  },
  fr: {
    app_title: "Chaps-e Generator by ChapsVision",
    login_title: "Connexion",
    login_subtitle: "Compte interne ChapsVision",
    login_email_placeholder: "nom@entreprise.com",
    login_password_placeholder: "Entre ton mot de passe",
    login_password: "Mot de passe",
    login_submit: "Se connecter",
    login_error_missing_config:
      "Configuration Supabase manquante: renseigne config.js pour activer la connexion et la bibliotheque cloud.",
    login_error_restore_session: "Impossible de restaurer la session.",
    login_error_supabase: "Supabase non configure.",
    login_error_required: "Email et mot de passe requis.",
    login_error_failed: "Connexion impossible: {message}",
    login_error_invalid_credentials_help:
      "Identifiants invalides. Cree d'abord cet utilisateur dans Supabase Auth > Users avec l'email mparrino@chapsvision.com et le mot de passe admin, puis reconnecte-toi.",
    login_error_signed_out: "Deconnexion impossible: {message}",
    save_title: "Nommer ton Chap-e",
    save_subtitle: "Ce nom sera utilise dans ta bibliotheque.",
    save_name_label: "Nom du Chap-e",
    save_name_placeholder: "Ex: Mascotte Support",
    save_cancel: "Annuler",
    save_confirm: "Sauvegarder",
    save_name_required: "Le nom est obligatoire.",
    save_error_failed: "Sauvegarde impossible: {message}",
    save_error_supabase: "Supabase non configure.",
    save_error_connect: "Connecte-toi pour sauvegarder.",
    save_error_missing_config: "Supabase non configure. Impossible de sauvegarder dans la bibliotheque.",
    nav_generator: "Generator",
    nav_guide: "Guide",
    nav_my_chaps: "Ma bibliotheque",
    profile_not_connected: "Non connecte",
    profile_connected: "Connecte: {email}",
    role_label: "{role}",
    role_admin: "Admin",
    role_user: "Utilisateur",
    language_toggle: "Passe en 🇬🇧 Anglais",
    password_btn: "Modifier mon mot de passe",
    password_modal_title: "Modifier le mot de passe",
    password_modal_subtitle: "Definis ton nouveau mot de passe de compte.",
    password_new_label: "Nouveau mot de passe",
    password_confirm_label: "Confirmer le mot de passe",
    password_new_placeholder: "Entre un nouveau mot de passe",
    password_confirm_placeholder: "Confirme le nouveau mot de passe",
    password_modal_cancel: "Annuler",
    password_modal_confirm: "Mettre a jour",
    password_success: "Mot de passe mis a jour.",
    password_error_required: "Les deux champs mot de passe sont obligatoires.",
    password_error_mismatch: "Les mots de passe ne correspondent pas.",
    password_error_too_short: "Le mot de passe doit faire au moins 6 caracteres.",
    password_error: "Echec reinitialisation mot de passe: {message}",
    create_user_btn: "Creer un utilisateur",
    create_user_modal_title: "Creer un utilisateur",
    create_user_modal_subtitle: "Creer un nouveau compte actif.",
    create_user_email_label: "Email",
    create_user_email_placeholder: "nom@entreprise.com",
    create_user_password_label: "Mot de passe",
    create_user_password_placeholder: "Minimum 6 caracteres",
    create_user_confirm_label: "Confirmer le mot de passe",
    create_user_confirm_placeholder: "Confirmer le mot de passe",
    create_user_nom_label: "Nom",
    create_user_nom_placeholder: "Dupont",
    create_user_prenom_label: "Prenom",
    create_user_prenom_placeholder: "Jean",
    create_user_role_label: "Role",
    create_user_role_user: "Utilisateur",
    create_user_role_admin: "Admin",
    create_user_cancel: "Annuler",
    create_user_confirm: "Creer l'utilisateur",
    create_user_success: "Utilisateur cree et actif.",
    create_user_error_not_admin: "Seul un admin peut creer des utilisateurs.",
    create_user_error_required: "Tous les champs sont obligatoires.",
    create_user_error_email_invalid: "Email invalide.",
    create_user_error_password_short: "Le mot de passe doit faire au moins 6 caracteres.",
    create_user_error_password_mismatch: "Les mots de passe ne correspondent pas.",
    create_user_error_supabase: "Supabase non configure.",
    create_user_error_connect: "Connecte-toi d'abord.",
    create_user_error_email_exists: "Cet email existe deja.",
    create_user_error_edge_unreachable:
      "Impossible de joindre l'Edge Function. Deploie `admin-create-user` sur Supabase (Edge Functions) et verifie le CORS.",
    create_user_error_failed: "Creation utilisateur impossible: {message}",
    stats_btn: "Stats admin",
    stats_title: "Stats admin",
    stats_subtitle: "Stats sur l'ensemble des utilisateurs.",
    stats_total_saved: "Sauvegardes en bibliotheque",
    stats_exports_png: "Exports PNG",
    stats_exports_jpg: "Exports JPG",
    stats_loading: "Chargement des stats...",
    stats_error_supabase: "Supabase non configure.",
    stats_error_connect: "Connecte-toi d'abord.",
    stats_error_not_admin: "Seul un admin peut acceder aux stats.",
    stats_error_edge_unreachable:
      "Impossible de joindre l'Edge Function. Deploie `admin-stats` sur Supabase (Edge Functions) et verifie le CORS.",
    stats_error_failed: "Impossible de charger les stats: {message}",
    logout_btn: "Se deconnecter",
    panel_title: "Configuration",
    picker_left_arm: "Bras gauche",
    picker_right_arm: "Bras droit",
    picker_eyes: "Yeux",
    picker_head: "Tete",
    shadow_label: "Afficher le shadow",
    preset_1: "Preset Exemple 1",
    preset_2: "Preset Exemple 2",
    preset_3: "Preset Exemple 3",
    save_trigger: "Sauvegarder",
    save_as_svg: "Enregistrer en SVG",
    save_as_png: "Enregistrer en PNG",
    save_as_jpg: "Enregistrer en JPG",
    save_to_library: "Sauvegarder dans Ma bibliotheque",
    mychaps_title: "Ma bibliotheque",
    mychaps_subtitle: "Tes Chap-e sauvegardes pour ton compte.",
    guide_prev: "Precedent",
    guide_next: "Suivant",
    guide_title: "Guide d'usage",
    guide_subtitle: "Les do / don't d'utilisation de Chaps-e.",
    guide_case_1_title: "Regle n°1 : choix Light / Dark",
    guide_case_1_intro_title: "Application :",
    guide_case_1_intro_line_1: "Light Chaps-e : uniquement sur fond clair",
    guide_case_1_intro_line_2: "Dark Chaps-e : uniquement sur fond sombre",
    guide_case_2_title: "Regle n°2 : usage des assets officiels",
    guide_case_2_intro_title: "Chaps-e doit etre monte via les composants Figma :",
    guide_case_2_intro_line_1: "Interdit : redessiner, modifier les proportions, etirer, recolorer...",
    guide_examples_label: "Exemple",
    guide_do: "Do",
    guide_dont: "Don't",
    preview_label: "Apercu robot",
    loading_assets: "Chargement des assets...",
    loading_error: "Erreur",
    assets_incomplete: "Assets incomplets.",
    export_png_failed: "Export PNG impossible.",
    export_jpg_failed: "Export JPG impossible.",
    library_missing_config:
      "Supabase n'est pas configure. Renseigne config.js pour activer la connexion et ta bibliotheque cloud.",
    library_not_connected: "Connecte-toi pour voir et sauvegarder ta bibliotheque.",
    library_empty: "Aucun Chap-e dans ta bibliotheque pour le moment.",
    library_load_error: "Erreur de chargement: {message}",
    library_date_unknown: "Date inconnue",
    library_created_on: "Cree le {date}",
    library_use: "Utiliser",
    library_delete: "Supprimer",
    library_delete_error: "Suppression impossible: {message}",
    save_default_name_prefix: "Chap-e",
    label_light: "Light",
    label_dark: "Dark",
  },
};

const BASE_POS = {
  torsoUpper: { x: 28.5246, y: 42.0354 },
  torsoLower: { x: 33.5312, y: 71.2239 },
  headDefault: { x: 14.0398, y: 0 },
  headTilted: { x: (SCENE.width - 63) / 2, y: 0 },
  shadow: { cx: 44, cy: 97.1197, rx: 13.803, ry: 3.00065, opacity: 0.2 },
};

const ARM_Y_FALLBACK = 46.8426;

const ARM_OFFSETS_EXACT = {
  left: {
    rest_open_down_side: { x: 0, y: 46.799 },
    rest_open_down_in: { x: 0, y: 46.4623 },
    wave_open_up_side: { x: 0, y: 35.7893 },
    wave_point_up_side: { x: 0, y: 35.5874 },
  },
  right: {
    rest_open_down_side: { x: 48, y: 46.85 },
    hold_grip_down_in: { x: 22.1781, y: 46.8426 },
    wave_open_up_side: { x: 48, y: 35.7893 },
    wave_point_up_side: { x: 48, y: 35.5874 },
  },
};

const EYES_TRANSFORMS_DEFAULT = {
  fallback: { a: 1, b: 0, c: 0, d: 1, e: 28.6556, f: 16.5398 },
  error: { a: 0.9988382, b: 0, c: 0, d: 0.9988382, e: 27.0521, f: 16.7391 },
  love: { a: 0.9245404, b: 0, c: 0, d: 0.9245404, e: 28.0284, f: 16.7158 },
  stars: { a: 1.0032008, b: 0, c: 0, d: 1.0032008, e: 26.4258, f: 15.9577 },
  wink: { a: 1, b: 0, c: 0, d: 1, e: 27.9339, f: 16.54 },
};

const HEAD_DEFAULT_EYE_ANCHORS = {
  left: { x: 35.146, y: 24.833 },
  right: { x: 52.9341, y: 24.833 },
};

const HEAD_TILTED_EYE_ANCHORS = {
  left: { x: 33.5913, y: 26.4351 },
  right: { x: 51.153, y: 23.6056 },
};

const HEAD_DEFAULT_TO_TILTED_MATRIX = similarityFromTwoPoints(
  HEAD_DEFAULT_EYE_ANCHORS.left,
  HEAD_DEFAULT_EYE_ANCHORS.right,
  HEAD_TILTED_EYE_ANCHORS.left,
  HEAD_TILTED_EYE_ANCHORS.right,
);

const assets = {
  torsoUpper: { light: null, dark: null },
  torsoLower: { light: null, dark: null },
  head: { light: {}, dark: {} },
  eyes: { light: {}, dark: {} },
  leftArm: { light: {}, dark: {} },
  rightArm: { light: {}, dark: {} },
};

const ui = {
  loginModal: byId("login-modal"),
  loginForm: byId("login-form"),
  loginEmail: byId("login-email"),
  loginPassword: byId("login-password"),
  loginError: byId("login-error"),

  saveModal: byId("save-modal"),
  saveForm: byId("save-form"),
  saveModalName: byId("save-modal-name"),
  saveModalError: byId("save-modal-error"),
  saveCancel: byId("save-cancel"),
  passwordModal: byId("password-modal"),
  passwordForm: byId("password-form"),
  passwordNewInput: byId("password-new-input"),
  passwordConfirmInput: byId("password-confirm-input"),
  passwordConfirmBtn: byId("password-confirm-btn"),
  passwordModalError: byId("password-modal-error"),
  passwordCancel: byId("password-cancel"),
  createUserModal: byId("create-user-modal"),
  createUserForm: byId("create-user-form"),
  createUserEmail: byId("create-user-email"),
  createUserPassword: byId("create-user-password"),
  createUserConfirm: byId("create-user-confirm"),
  createUserNom: byId("create-user-nom"),
  createUserPrenom: byId("create-user-prenom"),
  createUserRole: byId("create-user-role"),
  createUserError: byId("create-user-error"),
  createUserCancel: byId("create-user-cancel"),
  createUserConfirmBtn: byId("create-user-confirm-btn"),

  navGenerator: byId("nav-generator"),
  navGuide: byId("nav-guide"),
  navMyChaps: byId("nav-my-chaps"),
  viewGenerator: byId("view-generator"),
  viewGuide: byId("view-guide"),
  viewMyChaps: byId("view-my-chaps"),
  viewStats: byId("view-stats"),
  brandHome: byId("brand-home"),

  accountName: byId("account-name"),
  accountRole: byId("account-role"),
  profileAvatar: byId("profile-avatar"),
  profileMenuTrigger: byId("profile-menu-trigger"),
  profileMenu: byId("profile-menu"),
  langToggleBtn: byId("lang-toggle-btn"),
  passwordBtn: byId("password-btn"),
  createUserBtn: byId("create-user-btn"),
  statsBtn: byId("stats-btn"),
  logoutBtn: byId("logout-btn"),

  skin: byId("skin"),
  leftArm: byId("left-arm"),
  rightArm: byId("right-arm"),
  eyes: byId("eyes"),
  head: byId("head"),
  shadow: byId("shadow"),

  pickerSkinTrigger: byId("picker-skin-trigger"),
  pickerLeftArmTrigger: byId("picker-left-arm-trigger"),
  pickerRightArmTrigger: byId("picker-right-arm-trigger"),
  pickerEyesTrigger: byId("picker-eyes-trigger"),
  pickerHeadTrigger: byId("picker-head-trigger"),

  pickerSkinMenu: byId("picker-skin-menu"),
  pickerLeftArmMenu: byId("picker-left-arm-menu"),
  pickerRightArmMenu: byId("picker-right-arm-menu"),
  pickerEyesMenu: byId("picker-eyes-menu"),
  pickerHeadMenu: byId("picker-head-menu"),

  pickerSkinCurrent: byId("picker-skin-current"),
  pickerLeftArmCurrent: byId("picker-left-arm-current"),
  pickerRightArmCurrent: byId("picker-right-arm-current"),
  pickerEyesCurrent: byId("picker-eyes-current"),
  pickerHeadCurrent: byId("picker-head-current"),

  preset1: byId("preset-1"),
  preset2: byId("preset-2"),
  preset3: byId("preset-3"),
  preset1Emoji: byId("preset-1-emoji"),
  preset2Emoji: byId("preset-2-emoji"),
  preset3Emoji: byId("preset-3-emoji"),
  saveMenuTrigger: byId("save-menu-trigger"),
  saveMenu: byId("save-menu"),
  saveActionSvg: byId("save-action-svg"),
  saveActionPng: byId("save-action-png"),
  saveActionJpg: byId("save-action-jpg"),
  saveActionLibrary: byId("save-action-library"),
  preview: byId("preview"),
  state: byId("state"),

  guidePrevBtn: byId("guide-prev-btn"),
  guideNextBtn: byId("guide-next-btn"),
  guideTabs: byId("guide-tabs"),
  guideCases: byId("guide-cases"),
  myChapsList: byId("mychaps-list"),

  statsError: byId("stats-error"),
  statTotalSaved: byId("stat-total-saved"),
  statExportsPng: byId("stat-exports-png"),
  statExportsJpg: byId("stat-exports-jpg"),
};

const pickerDefs = [];

let currentConfig = { ...PRESET_EXAMPLE_1 };
let currentSvgMarkup = "";
let currentUser = null;
let currentUserProfile = null;
let currentLanguage = "en";
let openedPickerKey = null;
let isSaveMenuOpen = false;
let isProfileMenuOpen = false;
let assetsLoaded = false;
let currentGuideCaseIndex = 0;
let supabase = null;
let supabaseReady = false;
let authSubscription = null;

bootstrap().catch((error) => {
  console.error(error);
  ui.preview.innerHTML = `<div class="loading">${escapeHtml(`${t("loading_error")}: ${error.message || "Unknown error"}`)}</div>`;
});

async function bootstrap() {
  initLanguage();
  lockApp();
  initSelects();
  updatePresetEmojiLabels();
  applyStaticTranslations();
  bindEvents();
  setGeneratorInteractive(false);

  ui.preview.innerHTML = `<div class="loading">${escapeHtml(t("loading_assets"))}</div>`;
  await loadAllAssets();
  assetsLoaded = true;

  initVisualPickers();
  rebuildPickerMenus();
  applyConfig(PRESET_EXAMPLE_1);
  renderGuideCases();

  setGeneratorInteractive(true);
  setupSupabase();
  await restoreAuthSession();

  showView("generator");
  await renderMyChaps();
}

function byId(id) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element #${id} introuvable`);
  }
  return element;
}

function normalizeLanguage(raw) {
  return raw === "fr" ? "fr" : "en";
}

function getUiLocale() {
  return currentLanguage === "fr" ? "fr-FR" : "en-US";
}

function t(key, variables = {}) {
  const dictionary = I18N[currentLanguage] || I18N.en;
  const fallback = I18N.en;
  let template = dictionary[key] || fallback[key] || key;
  for (const [name, value] of Object.entries(variables)) {
    template = template.replaceAll(`{${name}}`, String(value));
  }
  return template;
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (!element) {
    return;
  }
  element.textContent = value;
}

function initLanguage() {
  const saved = normalizeLanguage(localStorage.getItem(STORAGE_UI_LANG));
  setLanguage(saved, { persist: false });
}

function setLanguage(nextLanguage, options = {}) {
  const persist = options.persist !== false;
  const normalized = normalizeLanguage(nextLanguage);
  currentLanguage = normalized;

  document.documentElement.lang = normalized;
  document.title = t("app_title");

  if (persist) {
    localStorage.setItem(STORAGE_UI_LANG, normalized);
  }

  applyStaticTranslations();
  updateAccountUi();
  if (pickerDefs.length) {
    rebuildPickerMenus();
  }
  render();
  renderGuideCases();
}

function applyStaticTranslations() {
  setText("login-title", t("login_title"));
  setText("login-subtitle", t("login_subtitle"));
  setText("login-email-label", "Email");
  setText("login-password-label", t("login_password"));
  ui.loginEmail.placeholder = t("login_email_placeholder");
  ui.loginPassword.placeholder = t("login_password_placeholder");
  setText("login-submit", t("login_submit"));

  setText("save-title", t("save_title"));
  setText("save-subtitle", t("save_subtitle"));
  setText("save-name-label", t("save_name_label"));
  ui.saveModalName.placeholder = t("save_name_placeholder");
  setText("save-cancel", t("save_cancel"));
  setText("save-confirm", t("save_confirm"));
  setText("password-title", t("password_modal_title"));
  setText("password-subtitle", t("password_modal_subtitle"));
  setText("password-new-label", t("password_new_label"));
  setText("password-confirm-label", t("password_confirm_label"));
  ui.passwordNewInput.placeholder = t("password_new_placeholder");
  ui.passwordConfirmInput.placeholder = t("password_confirm_placeholder");
  setText("password-cancel", t("password_modal_cancel"));
  setText("password-confirm-btn", t("password_modal_confirm"));

  setText("nav-generator-label", t("nav_generator"));
  setText("nav-guide-label", t("nav_guide"));
  setText("nav-my-chaps-label", t("nav_my_chaps"));
  setText("lang-toggle-label", t("language_toggle"));
  setText("password-btn-label", t("password_btn"));
  setText("create-user-btn-label", t("create_user_btn"));
  setText("stats-btn-label", t("stats_btn"));
  setText("logout-btn-label", t("logout_btn"));
  setText("create-user-title", t("create_user_modal_title"));
  setText("create-user-subtitle", t("create_user_modal_subtitle"));
  setText("create-user-email-label", t("create_user_email_label"));
  setText("create-user-password-label", t("create_user_password_label"));
  setText("create-user-confirm-label", t("create_user_confirm_label"));
  setText("create-user-nom-label", t("create_user_nom_label"));
  setText("create-user-prenom-label", t("create_user_prenom_label"));
  setText("create-user-role-label", t("create_user_role_label"));
  setText("create-user-role-user", t("create_user_role_user"));
  setText("create-user-role-admin", t("create_user_role_admin"));
  setText("create-user-cancel", t("create_user_cancel"));
  setText("create-user-confirm-btn", t("create_user_confirm"));
  ui.createUserEmail.placeholder = t("create_user_email_placeholder");
  ui.createUserPassword.placeholder = t("create_user_password_placeholder");
  ui.createUserConfirm.placeholder = t("create_user_confirm_placeholder");
  ui.createUserNom.placeholder = t("create_user_nom_placeholder");
  ui.createUserPrenom.placeholder = t("create_user_prenom_placeholder");

  setText("panel-title", t("panel_title"));
  setText("picker-left-arm-label", t("picker_left_arm"));
  setText("picker-right-arm-label", t("picker_right_arm"));
  setText("picker-eyes-label", t("picker_eyes"));
  setText("picker-head-label", t("picker_head"));
  setText("shadow-label", t("shadow_label"));
  setPresetButtonMeta(ui.preset1, t("preset_1"));
  setPresetButtonMeta(ui.preset2, t("preset_2"));
  setPresetButtonMeta(ui.preset3, t("preset_3"));
  setText("save-menu-trigger-label", t("save_trigger"));
  setText("save-action-svg-label", t("save_as_svg"));
  setText("save-action-png-label", t("save_as_png"));
  setText("save-action-jpg-label", t("save_as_jpg"));
  setText("save-action-library-label", t("save_to_library"));
  setText("guide-title", t("guide_title"));
  setText("guide-subtitle", t("guide_subtitle"));
  setText("guide-prev-label", t("guide_prev"));
  setText("guide-next-label", t("guide_next"));
  setText("stats-title", t("stats_title"));
  setText("stats-subtitle", t("stats_subtitle"));
  setText("stats-total-saved-label", t("stats_total_saved"));
  setText("stats-exports-png-label", t("stats_exports_png"));
  setText("stats-exports-jpg-label", t("stats_exports_jpg"));
  setText("mychaps-title", t("mychaps_title"));
  setText("mychaps-subtitle", t("mychaps_subtitle"));
  ui.preview.setAttribute("aria-label", t("preview_label"));
}

function setupSupabase() {
  const runtimeConfig = window.CHAPSE_CONFIG || {};
  const supabaseUrl = String(runtimeConfig.supabaseUrl || "").trim();
  const supabaseAnonKey = String(runtimeConfig.supabaseAnonKey || "").trim();

  const configMissing =
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl.includes("YOUR_SUPABASE_URL") ||
    supabaseAnonKey.includes("YOUR_SUPABASE_ANON_KEY");

  if (configMissing) {
    supabaseReady = false;
    setCloudFeaturesEnabled(false);
    showLoginModal();
    ui.loginError.textContent = t("login_error_missing_config");
    return;
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  supabaseReady = true;
  setCloudFeaturesEnabled(true);

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    handleAuthSession(session).catch((error) => {
      console.error(error);
    });
  });

  authSubscription = data.subscription;
}

async function restoreAuthSession() {
  if (!supabaseReady || !supabase) {
    currentUser = null;
    updateAccountUi();
    await renderMyChaps();
    return;
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error(error);
    showLoginModal();
    ui.loginError.textContent = t("login_error_restore_session");
    currentUser = null;
    currentUserProfile = null;
    updateAccountUi();
    await renderMyChaps();
    return;
  }

  await handleAuthSession(data.session);
}

async function handleAuthSession(session) {
  if (session?.user) {
    setCurrentUser(session.user);
    await ensureUserProfile(session.user);
    updateAccountUi();
    ui.loginError.textContent = "";
    hideLoginModal();
    await renderMyChaps();
    return;
  }

  currentUser = null;
  currentUserProfile = null;
  updateAccountUi();
  showLoginModal();
  await renderMyChaps();
}

async function ensureUserProfile(user) {
  if (!supabaseReady || !supabase || !user?.id) {
    currentUserProfile = null;
    return;
  }

  const email = String(user.email || "").toLowerCase();
  const emailLocalPart = email.split("@")[0] || "";
  const shouldBeAdmin = email === ADMIN_EMAIL.toLowerCase();
  const defaultRole = shouldBeAdmin ? ADMIN_PROFILE_DEFAULTS.role : "user";
  const defaultNom = shouldBeAdmin ? ADMIN_PROFILE_DEFAULTS.nom : emailLocalPart || "User";
  const defaultPrenom = shouldBeAdmin ? ADMIN_PROFILE_DEFAULTS.prenom : "";

  const { data, error } = await supabase
    .from(DB_TABLE_USERS)
    .select("user_id, email, nom, prenom, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error(error);
    currentUserProfile = {
      user_id: user.id,
      email: user.email || "",
      nom: defaultNom,
      prenom: defaultPrenom,
      role: defaultRole,
    };
    return;
  }

  if (!data) {
    const { data: created, error: createError } = await supabase
      .from(DB_TABLE_USERS)
      .insert({
        user_id: user.id,
        email: user.email || "",
        nom: defaultNom,
        prenom: defaultPrenom,
        role: defaultRole,
      })
      .select("user_id, email, nom, prenom, role")
      .single();

    if (createError) {
      console.error(createError);
      currentUserProfile = {
        user_id: user.id,
        email: user.email || "",
        nom: defaultNom,
        prenom: defaultPrenom,
        role: defaultRole,
      };
      return;
    }

    currentUserProfile = normalizeUserProfile(created, user);
    return;
  }

  const normalized = normalizeUserProfile(data, user);
  if (
    shouldBeAdmin &&
    (normalized.role !== ADMIN_PROFILE_DEFAULTS.role ||
      normalized.nom !== ADMIN_PROFILE_DEFAULTS.nom ||
      normalized.prenom !== ADMIN_PROFILE_DEFAULTS.prenom)
  ) {
    const { data: updated, error: updateError } = await supabase
      .from(DB_TABLE_USERS)
      .update({
        role: ADMIN_PROFILE_DEFAULTS.role,
        nom: ADMIN_PROFILE_DEFAULTS.nom,
        prenom: ADMIN_PROFILE_DEFAULTS.prenom,
      })
      .eq("user_id", user.id)
      .select("user_id, email, nom, prenom, role")
      .single();

    if (updateError) {
      console.error(updateError);
      normalized.role = ADMIN_PROFILE_DEFAULTS.role;
      normalized.nom = ADMIN_PROFILE_DEFAULTS.nom;
      normalized.prenom = ADMIN_PROFILE_DEFAULTS.prenom;
      currentUserProfile = normalized;
      return;
    }

    currentUserProfile = normalizeUserProfile(updated, user);
    return;
  }

  currentUserProfile = normalized;
}

function normalizeUserProfile(raw, user) {
  const roleValue = USER_ROLES.includes(raw?.role) ? raw.role : "user";
  return {
    user_id: raw?.user_id || user?.id || "",
    email: raw?.email || user?.email || "",
    nom: raw?.nom || "",
    prenom: raw?.prenom || "",
    role: roleValue,
  };
}

function setCloudFeaturesEnabled(enabled) {
  ui.navMyChaps.disabled = !enabled;
  ui.saveActionLibrary.disabled = !enabled;
}

function bindEvents() {
  ui.loginForm.addEventListener("submit", onLoginSubmit);
  ui.logoutBtn.addEventListener("click", onLogoutClick);
  ui.passwordBtn.addEventListener("click", onPasswordResetClick);
  ui.createUserBtn.addEventListener("click", onCreateUserClick);
  ui.statsBtn.addEventListener("click", onStatsClick);
  ui.langToggleBtn.addEventListener("click", onLanguageToggleClick);
  ui.profileMenuTrigger.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleProfileMenu();
  });
  ui.profileMenu.addEventListener("click", (event) => {
    event.stopPropagation();
  });
  ui.saveForm.addEventListener("submit", onSaveModalSubmit);
  ui.saveCancel.addEventListener("click", hideSaveModal);
  ui.passwordForm.addEventListener("submit", onPasswordModalSubmit);
  ui.passwordCancel.addEventListener("click", hidePasswordModal);
  ui.createUserForm.addEventListener("submit", onCreateUserSubmit);
  ui.createUserCancel.addEventListener("click", hideCreateUserModal);
  ui.passwordNewInput.addEventListener("input", onPasswordFieldsInput);
  ui.passwordConfirmInput.addEventListener("input", onPasswordFieldsInput);

  ui.navGenerator.addEventListener("click", () => showView("generator"));
  ui.navGuide.addEventListener("click", () => showView("guide"));
  ui.navMyChaps.addEventListener("click", async () => {
    showView("my-chaps");
    await renderMyChaps();
  });
  ui.brandHome.addEventListener("click", () => {
    closeProfileMenu();
    closeSaveMenu();
    closeAllPickerMenus();
    showView("generator");
  });
  ui.guidePrevBtn.addEventListener("click", () => shiftGuideCase(-1));
  ui.guideNextBtn.addEventListener("click", () => shiftGuideCase(1));
  ui.guideTabs.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    const button = target.closest("[data-guide-index]");
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }
    const index = Number(button.dataset.guideIndex);
    if (!Number.isInteger(index)) {
      return;
    }
    setGuideCaseIndex(index);
  });

  ui.skin.addEventListener("change", () => {
    syncStateFromControls();
    rebuildPickerMenus();
    render();
  });

  ui.leftArm.addEventListener("change", onControlChange);
  ui.rightArm.addEventListener("change", onControlChange);
  ui.eyes.addEventListener("change", onControlChange);
  ui.head.addEventListener("change", onControlChange);
  ui.shadow.addEventListener("change", onControlChange);

  ui.preset1.addEventListener("click", () => applyPreset(PRESET_EXAMPLE_1));
  ui.preset2.addEventListener("click", () => applyPreset(PRESET_EXAMPLE_2));
  ui.preset3.addEventListener("click", () => applyPreset(PRESET_EXAMPLE_3));

  ui.saveMenuTrigger.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleSaveMenu();
  });
  ui.saveMenu.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  ui.saveActionSvg.addEventListener("click", () => {
    closeSaveMenu();
    exportCurrentAsSvg();
  });
  ui.saveActionPng.addEventListener("click", async () => {
    closeSaveMenu();
    await exportCurrentAsPng();
  });
  ui.saveActionJpg.addEventListener("click", async () => {
    closeSaveMenu();
    await exportCurrentAsJpg();
  });
  ui.saveActionLibrary.addEventListener("click", () => {
    closeSaveMenu();
    openSaveModal();
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    if (!target.closest(".picker")) {
      closeAllPickerMenus();
    }
    if (!target.closest(".save-dropdown")) {
      closeSaveMenu();
    }
    if (!target.closest(".profile-menu-wrap")) {
      closeProfileMenu();
    }
  });
}

function initSelects() {
  fillSelect(ui.skin, SKINS);
  fillSelect(ui.leftArm, LEFT_ARM_VARIANTS);
  fillSelect(ui.rightArm, RIGHT_ARM_VARIANTS);
  fillSelect(ui.eyes, EYE_EXPRESSIONS);
  fillSelect(ui.head, HEAD_INCLINATIONS);

  ui.skin.value = PRESET_EXAMPLE_1.skin;
  ui.leftArm.value = PRESET_EXAMPLE_1.leftArm;
  ui.rightArm.value = PRESET_EXAMPLE_1.rightArm;
  ui.eyes.value = PRESET_EXAMPLE_1.eyes;
  ui.head.value = PRESET_EXAMPLE_1.head;
  ui.shadow.checked = PRESET_EXAMPLE_1.shadowEnabled;
}

function fillSelect(select, values) {
  select.innerHTML = "";
  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = toLabel(value);
    select.appendChild(option);
  }
}

function initVisualPickers() {
  pickerDefs.length = 0;

  pickerDefs.push(
    {
      key: "skin",
      trigger: ui.pickerSkinTrigger,
      menu: ui.pickerSkinMenu,
      current: ui.pickerSkinCurrent,
      options: () => SKINS,
    },
    {
      key: "leftArm",
      trigger: ui.pickerLeftArmTrigger,
      menu: ui.pickerLeftArmMenu,
      current: ui.pickerLeftArmCurrent,
      options: () => LEFT_ARM_VARIANTS,
    },
    {
      key: "rightArm",
      trigger: ui.pickerRightArmTrigger,
      menu: ui.pickerRightArmMenu,
      current: ui.pickerRightArmCurrent,
      options: () => RIGHT_ARM_VARIANTS,
    },
    {
      key: "eyes",
      trigger: ui.pickerEyesTrigger,
      menu: ui.pickerEyesMenu,
      current: ui.pickerEyesCurrent,
      options: () => EYE_EXPRESSIONS,
    },
    {
      key: "head",
      trigger: ui.pickerHeadTrigger,
      menu: ui.pickerHeadMenu,
      current: ui.pickerHeadCurrent,
      options: () => HEAD_INCLINATIONS,
    },
  );

  for (const def of pickerDefs) {
    def.trigger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      togglePicker(def.key);
    });

    def.menu.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }
}

function rebuildPickerMenus() {
  for (const def of pickerDefs) {
    def.menu.innerHTML = "";

    const options = def.options();
    const selectedValue = getSelectByKey(def.key).value;

    for (const value of options) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "picker-item";
      button.dataset.value = value;
      if (value === selectedValue) {
        button.classList.add("is-active");
      }

      const preview = document.createElement("span");
      preview.className = "picker-item-preview";
      preview.innerHTML = buildPickerPreview(def.key, value);

      const label = document.createElement("span");
      label.className = "picker-item-label";
      label.textContent = toLabel(value);

      button.append(preview, label);
      button.addEventListener("click", () => {
        const select = getSelectByKey(def.key);
        if (select.value === value) {
          closeAllPickerMenus();
          return;
        }

        select.value = value;

        if (def.key === "skin") {
          syncStateFromControls();
          rebuildPickerMenus();
          render();
        } else {
          onControlChange();
        }

        closeAllPickerMenus();
      });

      def.menu.appendChild(button);
    }
  }

  updatePickersUi();
}

function buildPickerPreview(key, value) {
  const skin = ui.skin.value || "light";

  if (key === "skin") {
    const chipClass = value === "dark" ? "skin-chip-dark" : "skin-chip-light";
    return `<span class="skin-chip ${chipClass}">${escapeHtml(value)}</span>`;
  }

  if (key === "leftArm") {
    const arm = resolveAsset(assets.leftArm, skin, value);
    return arm ? tinySvg(arm) : "";
  }

  if (key === "rightArm") {
    const arm = resolveAsset(assets.rightArm, skin, value);
    return arm ? tinySvg(arm) : "";
  }

  if (key === "eyes") {
    return buildEyesPickerPreview(value, skin);
  }

  if (key === "head") {
    const head = resolveAsset(assets.head, skin, value);
    return head ? tinySvg(head) : "";
  }

  return "";
}

function tinySvg(asset) {
  return `<svg viewBox="0 0 ${fmt(asset.width)} ${fmt(asset.height)}" xmlns="http://www.w3.org/2000/svg" fill="none">${asset.inner}</svg>`;
}

function buildEyesPickerPreview(expression, skin) {
  const eyes = resolveAsset(assets.eyes, skin, expression);
  if (!eyes) {
    return "";
  }

  const canvasSize = 100;
  const fitWidth = 78;
  const fitHeight = 42;

  const sourceViewBox =
    Array.isArray(eyes.viewBox) &&
    eyes.viewBox.length === 4 &&
    Number.isFinite(eyes.viewBox[2]) &&
    Number.isFinite(eyes.viewBox[3]) &&
    eyes.viewBox[2] > 0 &&
    eyes.viewBox[3] > 0
      ? eyes.viewBox
      : [0, 0, eyes.width || 1, eyes.height || 1];

  const sourceWidth = sourceViewBox[2];
  const sourceHeight = sourceViewBox[3];
  const scale = Math.min(fitWidth / sourceWidth, fitHeight / sourceHeight);
  const tx = (canvasSize - sourceWidth * scale) / 2 - sourceViewBox[0] * scale;
  const ty = (canvasSize - sourceHeight * scale) / 2 - sourceViewBox[1] * scale;

  return [
    `<svg viewBox="0 0 ${canvasSize} ${canvasSize}" xmlns="http://www.w3.org/2000/svg" fill="none">`,
    `<g transform="translate(${fmt(tx)} ${fmt(ty)}) scale(${fmt(scale)})">`,
    eyes.inner,
    "</g>",
    "</svg>",
  ].join("");
}

function togglePicker(key) {
  if (openedPickerKey === key) {
    closeAllPickerMenus();
    return;
  }

  closeAllPickerMenus();

  const def = pickerDefs.find((item) => item.key === key);
  if (!def) {
    return;
  }

  def.menu.hidden = false;
  def.trigger.setAttribute("aria-expanded", "true");
  openedPickerKey = key;
}

function closeAllPickerMenus() {
  for (const def of pickerDefs) {
    def.menu.hidden = true;
    def.trigger.setAttribute("aria-expanded", "false");
  }
  openedPickerKey = null;
}

function toggleSaveMenu() {
  if (isSaveMenuOpen) {
    closeSaveMenu();
    return;
  }
  ui.saveMenu.hidden = false;
  ui.saveMenuTrigger.setAttribute("aria-expanded", "true");
  isSaveMenuOpen = true;
}

function closeSaveMenu() {
  ui.saveMenu.hidden = true;
  ui.saveMenuTrigger.setAttribute("aria-expanded", "false");
  isSaveMenuOpen = false;
}

function toggleProfileMenu() {
  if (isProfileMenuOpen) {
    closeProfileMenu();
    return;
  }
  ui.profileMenu.hidden = false;
  ui.profileMenuTrigger.setAttribute("aria-expanded", "true");
  isProfileMenuOpen = true;
}

function closeProfileMenu() {
  ui.profileMenu.hidden = true;
  ui.profileMenuTrigger.setAttribute("aria-expanded", "false");
  isProfileMenuOpen = false;
}

function updatePickersUi() {
  for (const def of pickerDefs) {
    const select = getSelectByKey(def.key);
    const selectedValue = select.value;
    def.current.textContent = toLabel(selectedValue);

    const items = def.menu.querySelectorAll(".picker-item");
    items.forEach((item) => {
      item.classList.toggle("is-active", item.dataset.value === selectedValue);
    });
  }
}

function getSelectByKey(key) {
  if (key === "skin") {
    return ui.skin;
  }
  if (key === "leftArm") {
    return ui.leftArm;
  }
  if (key === "rightArm") {
    return ui.rightArm;
  }
  if (key === "eyes") {
    return ui.eyes;
  }
  if (key === "head") {
    return ui.head;
  }
  throw new Error(`Select inconnu pour key=${key}`);
}

function onControlChange() {
  syncStateFromControls();
  render();
}

function syncStateFromControls() {
  currentConfig = {
    skin: ui.skin.value,
    leftArm: ui.leftArm.value,
    rightArm: ui.rightArm.value,
    eyes: ui.eyes.value,
    head: ui.head.value,
    shadowEnabled: ui.shadow.checked,
  };

  updateGeneratorThemeMode();
  updatePickersUi();
}

function updateGeneratorThemeMode() {
  const isDarkSkin = (ui.skin.value || "light") === "dark";
  ui.viewGenerator.classList.toggle("is-dark", isDarkSkin);
}

function applyConfig(config) {
  if (SKINS.includes(config.skin)) {
    ui.skin.value = config.skin;
  }
  if (LEFT_ARM_VARIANTS.includes(config.leftArm)) {
    ui.leftArm.value = config.leftArm;
  }
  if (RIGHT_ARM_VARIANTS.includes(config.rightArm)) {
    ui.rightArm.value = config.rightArm;
  }
  if (EYE_EXPRESSIONS.includes(config.eyes)) {
    ui.eyes.value = config.eyes;
  }
  if (HEAD_INCLINATIONS.includes(config.head)) {
    ui.head.value = config.head;
  }

  ui.shadow.checked = Boolean(config.shadowEnabled);
  syncStateFromControls();
  rebuildPickerMenus();
  render();
}

function applyPreset(preset) {
  const activeSkin = SKINS.includes(ui.skin.value) ? ui.skin.value : "light";
  applyConfig({ ...preset, skin: activeSkin });
}

function render() {
  currentSvgMarkup = buildRobotSvg(currentConfig);
  ui.preview.innerHTML = currentSvgMarkup;
  ui.state.textContent = JSON.stringify(currentConfig, null, 2);
}

function buildRobotSvg(config) {
  const skin = config.skin || "light";

  const torsoLower = resolveAsset(assets.torsoLower, skin);
  const torsoUpper = resolveAsset(assets.torsoUpper, skin);
  const leftArm = resolveAsset(assets.leftArm, skin, config.leftArm);
  const rightArm = resolveAsset(assets.rightArm, skin, config.rightArm);
  const head = resolveAsset(assets.head, skin, config.head);
  const eyes = resolveAsset(assets.eyes, skin, config.eyes);

  if (!torsoLower || !torsoUpper || !leftArm || !rightArm || !head) {
    return `<div class="loading">${escapeHtml(t("assets_incomplete"))}</div>`;
  }

  const layers = [];

  layers.push(layerTranslate(torsoLower, BASE_POS.torsoLower.x, BASE_POS.torsoLower.y));
  layers.push(layerTranslate(torsoUpper, BASE_POS.torsoUpper.x, BASE_POS.torsoUpper.y));

  const leftOffset = getArmOffset("left", config.leftArm, leftArm.width);
  layers.push(layerTranslate(leftArm, leftOffset.x, leftOffset.y));

  const rightOffset = getArmOffset("right", config.rightArm, rightArm.width);
  layers.push(layerTranslate(rightArm, rightOffset.x, rightOffset.y));

  const headPos = config.head === "tilted" ? BASE_POS.headTilted : BASE_POS.headDefault;
  const headInner = config.eyes === "default" ? head.inner : head.innerNoEyes || head.inner;
  layers.push(layerTranslateRaw(headInner, headPos.x, headPos.y));

  if (config.eyes !== "default" && eyes) {
    const matrix = getEyesMatrix(config.head, config.eyes);
    layers.push(layerMatrix(eyes, matrix));
  }

  if (config.shadowEnabled) {
    layers.push(
      `<ellipse cx="${fmt(BASE_POS.shadow.cx)}" cy="${fmt(BASE_POS.shadow.cy)}" rx="${fmt(BASE_POS.shadow.rx)}" ry="${fmt(BASE_POS.shadow.ry)}" fill="#607C7F" fill-opacity="${fmt(BASE_POS.shadow.opacity)}"/>`,
    );
  }

  return [
    `<svg width="${SCENE.width}" height="${SCENE.height}" viewBox="0 0 ${SCENE.width} ${SCENE.height}" fill="none" xmlns="http://www.w3.org/2000/svg">`,
    ...layers,
    "</svg>",
  ].join("\n");
}

function layerTranslate(asset, x, y) {
  return `<g transform="translate(${fmt(x)} ${fmt(y)})">${asset.inner}</g>`;
}

function layerTranslateRaw(inner, x, y) {
  return `<g transform="translate(${fmt(x)} ${fmt(y)})">${inner}</g>`;
}

function layerMatrix(asset, matrix) {
  return `<g transform="matrix(${fmt(matrix.a)} ${fmt(matrix.b)} ${fmt(matrix.c)} ${fmt(matrix.d)} ${fmt(matrix.e)} ${fmt(matrix.f)})">${asset.inner}</g>`;
}

function getArmOffset(side, variant, assetWidth) {
  if (side === "left") {
    const exact = ARM_OFFSETS_EXACT.left[variant];
    if (exact) {
      return exact;
    }
    return { x: 0, y: ARM_Y_FALLBACK };
  }

  const exact = ARM_OFFSETS_EXACT.right[variant];
  if (exact) {
    return exact;
  }

  return {
    x: SCENE.width - assetWidth,
    y: ARM_Y_FALLBACK,
  };
}

function getEyesMatrix(head, eyes) {
  const base = EYES_TRANSFORMS_DEFAULT[eyes] || EYES_TRANSFORMS_DEFAULT.fallback;
  if (head === "default") {
    return base;
  }
  return composeMatrices(HEAD_DEFAULT_TO_TILTED_MATRIX, base);
}

function resolveAsset(collection, skin, variant) {
  if (variant !== undefined) {
    return collection[skin]?.[variant] || collection.light?.[variant] || null;
  }
  return collection[skin] || collection.light || null;
}

async function loadAllAssets() {
  await loadSkinAssets("light");
  await loadSkinAssets("dark");
}

async function loadSkinAssets(skin) {
  assets.torsoUpper[skin] = await fetchSvg(pathForTorso(skin, "torso_upper"));
  assets.torsoLower[skin] = await fetchSvg(pathForTorso(skin, "torso_lower"));

  await Promise.all(
    HEAD_INCLINATIONS.map(async (inclination) => {
      assets.head[skin][inclination] = await fetchSvg(pathForHead(skin, inclination));
    }),
  );

  await Promise.all(
    LEFT_ARM_VARIANTS.map(async (variant) => {
      assets.leftArm[skin][variant] = await fetchSvg(pathForLeftArm(skin, variant));
    }),
  );

  await Promise.all(
    RIGHT_ARM_VARIANTS.map(async (variant) => {
      assets.rightArm[skin][variant] = await fetchSvg(pathForRightArm(skin, variant));
    }),
  );

  await Promise.all(
    EYE_EXPRESSIONS.map(async (expression) => {
      if (skin === "light") {
        assets.eyes.light[expression] = await fetchSvg(pathForEyes("light", expression));
        return;
      }

      // Les assets yeux dark n'existent pas dans ce projet.
      // On reutilise directement les yeux light sans requete reseau.
      assets.eyes.dark[expression] = assets.eyes.light[expression] || null;
    }),
  );
}

function pathForTorso(skin, part) {
  return skin === "dark" ? `assets/torso/dark/${part}.svg` : `assets/torso/${part}.svg`;
}

function pathForHead(skin, inclination) {
  return skin === "dark"
    ? `assets/head/dark/inclination=${inclination}.svg`
    : `assets/head/inclination=${inclination}.svg`;
}

function pathForLeftArm(skin, variant) {
  return skin === "dark"
    ? `assets/left_arm/dark/variant=${variant}.svg`
    : `assets/left_arm/variant=${variant}.svg`;
}

function pathForRightArm(skin, variant) {
  return skin === "dark"
    ? `assets/arm_right/dark/variant=${variant}.svg`
    : `assets/arm_right/variant=${variant}.svg`;
}

function pathForEyes(skin, expression) {
  return `assets/eyes/expression=${expression}.svg`;
}

async function fetchSvg(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Impossible de charger ${path} (${response.status})`);
  }

  const raw = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(raw, "image/svg+xml");
  if (doc.querySelector("parsererror")) {
    throw new Error(`SVG invalide: ${path}`);
  }

  const svg = doc.documentElement;
  const viewBox = parseViewBox(svg.getAttribute("viewBox"));

  let width = parseFloat(svg.getAttribute("width") || "");
  let height = parseFloat(svg.getAttribute("height") || "");

  if (!Number.isFinite(width)) {
    width = viewBox[2];
  }
  if (!Number.isFinite(height)) {
    height = viewBox[3];
  }

  return {
    path,
    width,
    height,
    viewBox,
    inner: svg.innerHTML,
    innerNoEyes: path.includes("/head/") ? stripHeadEyes(svg) : null,
  };
}

function stripHeadEyes(svgElement) {
  const clone = svgElement.cloneNode(true);

  clone.querySelectorAll('[fill="#F1F8F4"]').forEach((node) => {
    node.remove();
  });

  clone.querySelectorAll("defs").forEach((node) => {
    node.remove();
  });

  clone.querySelectorAll("g").forEach((group) => {
    if (!group.children.length && !group.textContent.trim()) {
      group.remove();
    }
  });

  return clone.innerHTML;
}

function parseViewBox(viewBoxAttr) {
  if (!viewBoxAttr) {
    return [0, 0, 0, 0];
  }

  const parts = viewBoxAttr
    .trim()
    .split(/\s+/)
    .map((value) => Number(value));

  if (parts.length !== 4 || parts.some((value) => Number.isNaN(value))) {
    return [0, 0, 0, 0];
  }

  return parts;
}

async function onLoginSubmit(event) {
  event.preventDefault();

  if (!supabaseReady || !supabase) {
    ui.loginError.textContent = t("login_error_supabase");
    return;
  }

  const email = ui.loginEmail.value.trim().toLowerCase();
  const password = ui.loginPassword.value.trim();

  if (!email || !password) {
    ui.loginError.textContent = t("login_error_required");
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const baseMessage = t("login_error_failed", { message: error.message });
    const details = String(error.message || "").toLowerCase();
    if (details.includes("invalid login credentials")) {
      ui.loginError.textContent = `${baseMessage} ${t("login_error_invalid_credentials_help")}`;
      return;
    }
    ui.loginError.textContent = baseMessage;
    return;
  }

  ui.loginError.textContent = "";
  ui.loginForm.reset();
}

async function onLogoutClick() {
  hideSaveModal();
  hidePasswordModal();
  hideCreateUserModal();
  closeSaveMenu();
  closeProfileMenu();

  if (supabaseReady && supabase) {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
      ui.loginError.textContent = t("login_error_signed_out", { message: error.message });
      return;
    }
  }

  currentUser = null;
  currentUserProfile = null;
  updateAccountUi();
  showView("generator");
  showLoginModal();
  await renderMyChaps();
}

async function onPasswordResetClick() {
  closeProfileMenu();

  if (!supabaseReady || !supabase) {
    ui.loginError.textContent = t("login_error_supabase");
    return;
  }

  const email = String(currentUser?.email || "").trim().toLowerCase();
  if (!email) {
    showLoginModal();
    ui.loginError.textContent = t("save_error_connect");
    return;
  }

  showPasswordModal();
}

async function onCreateUserClick() {
  closeProfileMenu();

  if (!supabaseReady || !supabase) {
    ui.loginError.textContent = t("create_user_error_supabase");
    return;
  }
  if (!currentUser?.id) {
    showLoginModal();
    ui.loginError.textContent = t("create_user_error_connect");
    return;
  }
  if (!isCurrentUserAdmin()) {
    ui.loginError.textContent = t("create_user_error_not_admin");
    return;
  }

  showCreateUserModal();
}

async function onStatsClick() {
  closeProfileMenu();
  closeSaveMenu();
  closeAllPickerMenus();
  showView("stats");
  await renderStats();
}

async function renderStats() {
  ui.statsError.classList.remove("is-error");
  ui.statsError.textContent = "";
  ui.statTotalSaved.textContent = "—";
  ui.statExportsPng.textContent = "—";
  ui.statExportsJpg.textContent = "—";

  if (!supabaseReady || !supabase) {
    ui.statsError.classList.add("is-error");
    ui.statsError.textContent = t("stats_error_supabase");
    return;
  }
  if (!currentUser?.id) {
    ui.statsError.classList.add("is-error");
    ui.statsError.textContent = t("stats_error_connect");
    showLoginModal();
    return;
  }
  if (!isCurrentUserAdmin()) {
    ui.statsError.classList.add("is-error");
    ui.statsError.textContent = t("stats_error_not_admin");
    return;
  }

  ui.statsError.textContent = t("stats_loading");

  const { data, error } = await supabase.functions.invoke("admin-stats", { body: {} });
  if (error) {
    const message = String(error.message || "");
    const lower = message.toLowerCase();
    ui.statsError.classList.add("is-error");
    if (lower.includes("failed to send a request") || lower.includes("failed to fetch")) {
      ui.statsError.textContent = t("stats_error_edge_unreachable");
      return;
    }
    if (lower.includes("forbidden")) {
      ui.statsError.textContent = t("stats_error_not_admin");
      return;
    }
    ui.statsError.textContent = t("stats_error_failed", { message: message || "Unknown error" });
    return;
  }

  const totalSaved = Number(data?.total_saved ?? 0);
  const exportsPng = Number(data?.exports_png ?? 0);
  const exportsJpg = Number(data?.exports_jpg ?? 0);

  ui.statsError.textContent = "";
  ui.statTotalSaved.textContent = Number.isFinite(totalSaved) ? String(totalSaved) : "0";
  ui.statExportsPng.textContent = Number.isFinite(exportsPng) ? String(exportsPng) : "0";
  ui.statExportsJpg.textContent = Number.isFinite(exportsJpg) ? String(exportsJpg) : "0";
}

async function onPasswordModalSubmit(event) {
  event.preventDefault();
  ui.passwordModalError.textContent = "";

  if (!supabaseReady || !supabase) {
    ui.passwordModalError.textContent = t("login_error_supabase");
    return;
  }

  if (!currentUser?.id) {
    hidePasswordModal();
    showLoginModal();
    ui.loginError.textContent = t("save_error_connect");
    return;
  }

  const newPassword = String(ui.passwordNewInput.value || "");
  const confirmPassword = String(ui.passwordConfirmInput.value || "");

  if (!newPassword || !confirmPassword) {
    ui.passwordModalError.textContent = t("password_error_required");
    return;
  }

  if (newPassword.length < 6) {
    ui.passwordModalError.textContent = t("password_error_too_short");
    return;
  }

  if (newPassword !== confirmPassword) {
    ui.passwordModalError.textContent = t("password_error_mismatch");
    return;
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    ui.passwordModalError.textContent = t("password_error", { message: error.message });
    return;
  }

  hidePasswordModal();
  alert(t("password_success"));
}

function onPasswordFieldsInput() {
  if (ui.passwordModalError.textContent) {
    ui.passwordModalError.textContent = "";
  }
  updatePasswordSubmitState();
}

function isPasswordFormValid() {
  const newPassword = String(ui.passwordNewInput.value || "").trim();
  const confirmPassword = String(ui.passwordConfirmInput.value || "").trim();
  if (!newPassword || !confirmPassword) {
    return false;
  }
  if (newPassword.length < 6) {
    return false;
  }
  return newPassword === confirmPassword;
}

function updatePasswordSubmitState() {
  ui.passwordConfirmBtn.disabled = !isPasswordFormValid();
}

async function onLanguageToggleClick() {
  closeProfileMenu();
  const next = currentLanguage === "en" ? "fr" : "en";
  setLanguage(next);
  await renderMyChaps();
}

async function onCreateUserSubmit(event) {
  event.preventDefault();
  ui.createUserError.textContent = "";

  if (!supabaseReady || !supabase) {
    ui.createUserError.textContent = t("create_user_error_supabase");
    return;
  }
  if (!currentUser?.id) {
    hideCreateUserModal();
    showLoginModal();
    ui.loginError.textContent = t("create_user_error_connect");
    return;
  }
  if (!isCurrentUserAdmin()) {
    ui.createUserError.textContent = t("create_user_error_not_admin");
    return;
  }

  const email = String(ui.createUserEmail.value || "").trim().toLowerCase();
  const password = String(ui.createUserPassword.value || "");
  const confirm = String(ui.createUserConfirm.value || "");
  const nom = String(ui.createUserNom.value || "").trim();
  const prenom = String(ui.createUserPrenom.value || "").trim();
  const role = USER_ROLES.includes(String(ui.createUserRole.value || "")) ? ui.createUserRole.value : "user";

  if (!email || !password || !confirm || !nom || !prenom || !role) {
    ui.createUserError.textContent = t("create_user_error_required");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    ui.createUserError.textContent = t("create_user_error_email_invalid");
    return;
  }
  if (password.length < 6) {
    ui.createUserError.textContent = t("create_user_error_password_short");
    return;
  }
  if (password !== confirm) {
    ui.createUserError.textContent = t("create_user_error_password_mismatch");
    return;
  }

  ui.createUserConfirmBtn.disabled = true;

  const { error } = await supabase.functions.invoke("admin-create-user", {
    body: { email, password, nom, prenom, role },
  });

  ui.createUserConfirmBtn.disabled = false;

  if (error) {
    const message = String(error.message || "");
    const details = message.toLowerCase();
    if (details.includes("failed to send a request") || details.includes("failed to fetch")) {
      ui.createUserError.textContent = t("create_user_error_edge_unreachable");
      return;
    }
    if (details.includes("email_already_exists") || details.includes("duplicate")) {
      ui.createUserError.textContent = t("create_user_error_email_exists");
      return;
    }
    if (details.includes("forbidden")) {
      ui.createUserError.textContent = t("create_user_error_not_admin");
      return;
    }
    ui.createUserError.textContent = t("create_user_error_failed", { message });
    return;
  }

  hideCreateUserModal();
  alert(t("create_user_success"));
}

function setCurrentUser(user) {
  currentUser = user;
  updateAccountUi();
}

function updateAccountUi() {
  if (!currentUser) {
    ui.accountName.textContent = t("profile_not_connected");
    ui.accountRole.textContent = t("role_label", { role: t("role_user") });
    ui.profileAvatar.textContent = "CV";
    ui.createUserBtn.hidden = true;
    ui.statsBtn.hidden = true;
    return;
  }

  const profile = currentUserProfile;
  const fullName = [profile?.prenom, profile?.nom].map((value) => String(value || "").trim()).filter(Boolean).join(" ");
  const fallbackEmail = String(currentUser.email || currentUser.id || "").trim();
  const displayName = fullName || fallbackEmail;
  const role = profile?.role === "admin" ? "admin" : "user";
  const isAdmin = role === "admin";

  ui.accountName.textContent = displayName || t("profile_connected", { email: fallbackEmail });
  ui.accountRole.textContent = t("role_label", { role: t(`role_${role}`) });
  ui.profileAvatar.textContent = buildInitials(displayName || fallbackEmail);
  ui.createUserBtn.hidden = !isAdmin;
  ui.statsBtn.hidden = !isAdmin;
}

function showLoginModal() {
  hidePasswordModal();
  hideCreateUserModal();
  ui.loginModal.hidden = false;
  lockApp();
}

function hideLoginModal() {
  ui.loginModal.hidden = true;
  unlockApp();
}

function openSaveModal() {
  if (!supabaseReady || !supabase) {
    showLoginModal();
    ui.loginError.textContent = t("save_error_missing_config");
    return;
  }

  if (!currentUser) {
    showLoginModal();
    ui.loginError.textContent = t("save_error_connect");
    return;
  }

  ui.saveModalError.textContent = "";
  ui.saveModalName.value = buildDefaultChapEName();
  ui.saveModal.hidden = false;
  lockApp();
  ui.saveModalName.focus();
  ui.saveModalName.select();
}

function hideSaveModal() {
  ui.saveModal.hidden = true;
  ui.saveModalError.textContent = "";
  unlockApp();
}

function showPasswordModal() {
  ui.passwordModal.hidden = false;
  ui.passwordModalError.textContent = "";
  updatePasswordSubmitState();
  lockApp();
  ui.passwordNewInput.focus();
}

function hidePasswordModal() {
  ui.passwordModal.hidden = true;
  ui.passwordModalError.textContent = "";
  if (ui.passwordForm) {
    ui.passwordForm.reset();
  }
  updatePasswordSubmitState();
  unlockApp();
}

function showCreateUserModal() {
  ui.createUserModal.hidden = false;
  ui.createUserError.textContent = "";
  if (ui.createUserForm) {
    ui.createUserForm.reset();
  }
  ui.createUserRole.value = "user";
  ui.createUserConfirmBtn.disabled = false;
  lockApp();
  ui.createUserEmail.focus();
}

function hideCreateUserModal() {
  ui.createUserModal.hidden = true;
  ui.createUserError.textContent = "";
  if (ui.createUserForm) {
    ui.createUserForm.reset();
  }
  ui.createUserConfirmBtn.disabled = false;
  unlockApp();
}

function lockApp() {
  document.body.classList.add("is-locked");
}

function unlockApp() {
  if (ui.loginModal.hidden && ui.saveModal.hidden && ui.passwordModal.hidden && ui.createUserModal.hidden) {
    document.body.classList.remove("is-locked");
  }
}

function isCurrentUserAdmin() {
  return currentUserProfile?.role === "admin";
}

function showView(view) {
  const isGenerator = view === "generator";
  const isGuide = view === "guide";
  const isMyChaps = view === "my-chaps";
  const isStats = view === "stats";

  ui.viewGenerator.classList.toggle("is-active", isGenerator);
  ui.viewGuide.classList.toggle("is-active", isGuide);
  ui.viewMyChaps.classList.toggle("is-active", isMyChaps);
  ui.viewStats.classList.toggle("is-active", isStats);

  ui.navGenerator.classList.toggle("is-active", isGenerator);
  ui.navGuide.classList.toggle("is-active", isGuide);
  ui.navMyChaps.classList.toggle("is-active", isMyChaps);
}

function exportCurrentAsSvg() {
  if (!currentSvgMarkup) {
    return;
  }
  const fileName = `chaps-e-${buildFileStem(currentConfig)}.svg`;
  downloadSvgMarkup(currentSvgMarkup, fileName);
}

async function exportCurrentAsPng() {
  if (!currentSvgMarkup) {
    return;
  }
  const fileName = `chaps-e-${buildFileStem(currentConfig)}.png`;
  try {
    await exportPngFromSvgMarkup(currentSvgMarkup, fileName);
  } catch (error) {
    console.error(error);
    alert(t("export_png_failed"));
  }
}

async function exportCurrentAsJpg() {
  if (!currentSvgMarkup) {
    return;
  }
  const fileName = `chaps-e-${buildFileStem(currentConfig)}.jpg`;
  try {
    await exportJpgFromSvgMarkup(currentSvgMarkup, fileName);
  } catch (error) {
    console.error(error);
    alert(t("export_jpg_failed"));
  }
}

async function onSaveModalSubmit(event) {
  event.preventDefault();

  if (!supabaseReady || !supabase) {
    ui.saveModalError.textContent = t("save_error_supabase");
    return;
  }

  if (!currentUser || !currentUser.id) {
    hideSaveModal();
    showLoginModal();
    ui.loginError.textContent = t("save_error_connect");
    return;
  }

  const rawName = ui.saveModalName.value.trim();
  if (!rawName) {
    ui.saveModalError.textContent = t("save_name_required");
    return;
  }

  const { error } = await supabase.from(DB_TABLE_CHAPES).insert({
    user_id: currentUser.id,
    name: rawName,
    config_json: currentConfig,
  });

  if (error) {
    ui.saveModalError.textContent = t("save_error_failed", { message: error.message });
    return;
  }

  hideSaveModal();
  await renderMyChaps();
}

function renderGuideCases() {
  if (!ui.guideCases) {
    return;
  }

  renderGuideNavigation();

  if (!assetsLoaded) {
    ui.guideCases.innerHTML = `<p class="empty-state">${escapeHtml(t("loading_assets"))}</p>`;
    return;
  }

  const guideCase = GUIDE_CASES[currentGuideCaseIndex];
  if (!guideCase) {
    ui.guideCases.innerHTML = "";
    return;
  }

  const introLines = guideCase.introLines
    .map((lineKey) => `<p class="guide-rule-line">→ ${escapeHtml(t(lineKey))}</p>`)
    .join("");

  const cards = guideCase.items
    .map((item) => {
      const statusLabel = item.isDo ? t("guide_do") : t("guide_dont");
      const statusClass = item.isDo ? "is-do" : "is-dont";
      const statusIcon = item.isDo ? "fa-check" : "fa-xmark";
      const surfaceClass = item.surface === "dark" ? "surface-dark" : "surface-light";
      const noteMarkup = item.noteKey
        ? `<p class="guide-card-note">${escapeHtml(t(item.noteKey))}</p>`
        : "";

      return [
        `<article class="guide-card ${surfaceClass}">`,
        `<div class="guide-card-preview">${buildGuideItemPreview(item)}</div>`,
        noteMarkup,
        `<div class="guide-card-status ${statusClass}">`,
        `<i class="fa-solid ${statusIcon}" aria-hidden="true"></i>`,
        `<span>${escapeHtml(statusLabel)}</span>`,
        "</div>",
        "</article>",
      ].join("");
    })
    .join("");

  ui.guideCases.innerHTML = [
    '<article class="guide-case">',
    `<h3 class="guide-case-title">${escapeHtml(t(guideCase.titleKey))}</h3>`,
    '<div class="guide-case-body">',
    '<div class="guide-application">',
    `<p class="guide-application-title">${escapeHtml(t(guideCase.introTitleKey))}</p>`,
    introLines,
    "</div>",
    `<div class="guide-grid">${cards}</div>`,
    "</div>",
    "</article>",
  ].join("");
}

function renderGuideNavigation() {
  if (!ui.guideTabs || !ui.guidePrevBtn || !ui.guideNextBtn) {
    return;
  }

  if (!GUIDE_CASES.length) {
    ui.guideTabs.innerHTML = "";
    ui.guidePrevBtn.disabled = true;
    ui.guideNextBtn.disabled = true;
    return;
  }

  currentGuideCaseIndex = Math.min(Math.max(currentGuideCaseIndex, 0), GUIDE_CASES.length - 1);

  ui.guidePrevBtn.disabled = currentGuideCaseIndex <= 0;
  ui.guideNextBtn.disabled = currentGuideCaseIndex >= GUIDE_CASES.length - 1;

  ui.guideTabs.innerHTML = GUIDE_CASES.map((guideCase, index) => {
    const isActive = index === currentGuideCaseIndex;
    const activeClass = isActive ? " is-active" : "";
    const title = escapeHtml(t(guideCase.titleKey));
    return [
      `<button type="button" class="guide-tab${activeClass}" role="tab" aria-controls="guide-cases"`,
      `aria-selected="${isActive ? "true" : "false"}"`,
      `title="${title}" aria-label="${title}" data-guide-index="${index}">`,
      `${index + 1}`,
      "</button>",
    ].join(" ");
  }).join("");
}

function setGuideCaseIndex(index) {
  if (!GUIDE_CASES.length) {
    return;
  }
  const nextIndex = Math.min(Math.max(index, 0), GUIDE_CASES.length - 1);
  if (nextIndex === currentGuideCaseIndex) {
    return;
  }
  currentGuideCaseIndex = nextIndex;
  renderGuideCases();
}

function shiftGuideCase(delta) {
  setGuideCaseIndex(currentGuideCaseIndex + delta);
}

function buildGuideItemPreview(item) {
  if (item.type === "asset" && item.assetPath) {
    return `<img class="guide-card-image" src="${escapeHtml(item.assetPath)}" alt="" loading="lazy" decoding="async"/>`;
  }

  const skin = item.skin === "dark" ? "dark" : "light";
  const config = buildGuideRobotConfig(skin);
  return buildRobotSvg(config);
}

function buildGuideRobotConfig(skin) {
  return {
    ...PRESET_EXAMPLE_1,
    skin,
    leftArm: "rest_open_down_side",
    rightArm: "rest_open_down_side",
    eyes: "default",
    head: "default",
    shadowEnabled: true,
  };
}

async function renderMyChaps() {
  ui.myChapsList.innerHTML = "";

  if (!supabaseReady || !supabase) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = t("library_missing_config");
    ui.myChapsList.appendChild(empty);
    return;
  }

  if (!currentUser || !currentUser.id) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = t("library_not_connected");
    ui.myChapsList.appendChild(empty);
    return;
  }

  const { data, error } = await supabase
    .from(DB_TABLE_CHAPES)
    .select("id, name, config_json, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = t("library_load_error", { message: error.message });
    ui.myChapsList.appendChild(empty);
    return;
  }

  const saved = (data || []).map((entry) => ({
    id: entry.id,
    name: entry.name,
    config: sanitizeConfig(entry.config_json),
    createdAt: entry.created_at,
  }));

  if (!saved.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = t("library_empty");
    ui.myChapsList.appendChild(empty);
    return;
  }

  for (const entry of saved) {
    const card = document.createElement("article");
    card.className = "saved-card";

    const preview = document.createElement("div");
    preview.className = "saved-preview";
    preview.innerHTML = buildRobotSvg(entry.config);

    const meta = document.createElement("div");
    meta.className = "saved-meta";

    const title = document.createElement("h3");
    title.textContent = entry.name;

    const dateText = document.createElement("p");
    const date = new Date(entry.createdAt);
    if (Number.isNaN(date.getTime())) {
      dateText.textContent = t("library_date_unknown");
    } else {
      const formatted = date.toLocaleString(getUiLocale(), {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
      dateText.textContent = t("library_created_on", { date: formatted });
    }

    meta.append(title, dateText);

    const actions = document.createElement("div");
    actions.className = "saved-actions";

    const useBtn = document.createElement("button");
    useBtn.type = "button";
    useBtn.innerHTML =
      `<i class="fa-regular fa-circle-check icon-inline" aria-hidden="true"></i><span>${escapeHtml(t("library_use"))}</span>`;
    useBtn.addEventListener("click", () => {
      applyConfig(entry.config);
      showView("generator");
    });

    const svgBtn = document.createElement("button");
    svgBtn.type = "button";
    svgBtn.innerHTML =
      '<i class="fa-regular fa-file-lines icon-inline" aria-hidden="true"></i><span>SVG</span>';
    svgBtn.addEventListener("click", () => {
      const svgMarkup = buildRobotSvg(entry.config);
      downloadSvgMarkup(svgMarkup, `chaps-e-${toSlug(entry.name)}.svg`);
    });

    const pngBtn = document.createElement("button");
    pngBtn.type = "button";
    pngBtn.innerHTML = '<i class="fa-regular fa-image icon-inline" aria-hidden="true"></i><span>PNG</span>';
    pngBtn.addEventListener("click", async () => {
      try {
        const svgMarkup = buildRobotSvg(entry.config);
        await exportPngFromSvgMarkup(svgMarkup, `chaps-e-${toSlug(entry.name)}.png`);
      } catch (error) {
        console.error(error);
        alert(t("export_png_failed"));
      }
    });

    const jpgBtn = document.createElement("button");
    jpgBtn.type = "button";
    jpgBtn.innerHTML = '<i class="fa-regular fa-image icon-inline" aria-hidden="true"></i><span>JPG</span>';
    jpgBtn.addEventListener("click", async () => {
      try {
        const svgMarkup = buildRobotSvg(entry.config);
        await exportJpgFromSvgMarkup(svgMarkup, `chaps-e-${toSlug(entry.name)}.jpg`);
      } catch (error) {
        console.error(error);
        alert(t("export_jpg_failed"));
      }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.innerHTML =
      `<i class="fa-regular fa-trash-can icon-inline" aria-hidden="true"></i><span>${escapeHtml(t("library_delete"))}</span>`;
    deleteBtn.addEventListener("click", async () => {
      const { error: deleteError } = await supabase.from(DB_TABLE_CHAPES).delete().eq("id", entry.id);
      if (deleteError) {
        alert(t("library_delete_error", { message: deleteError.message }));
        return;
      }
      await renderMyChaps();
    });

    actions.append(useBtn, svgBtn, pngBtn, jpgBtn, deleteBtn);

    card.append(preview, meta, actions);
    ui.myChapsList.appendChild(card);
  }
}

function sanitizeConfig(rawConfig) {
  const source = rawConfig && typeof rawConfig === "object" ? rawConfig : {};

  return {
    skin: SKINS.includes(source.skin) ? source.skin : PRESET_EXAMPLE_1.skin,
    leftArm: LEFT_ARM_VARIANTS.includes(source.leftArm) ? source.leftArm : PRESET_EXAMPLE_1.leftArm,
    rightArm: RIGHT_ARM_VARIANTS.includes(source.rightArm) ? source.rightArm : PRESET_EXAMPLE_1.rightArm,
    eyes: EYE_EXPRESSIONS.includes(source.eyes) ? source.eyes : PRESET_EXAMPLE_1.eyes,
    head: HEAD_INCLINATIONS.includes(source.head) ? source.head : PRESET_EXAMPLE_1.head,
    shadowEnabled:
      typeof source.shadowEnabled === "boolean" ? source.shadowEnabled : PRESET_EXAMPLE_1.shadowEnabled,
  };
}

function buildDefaultChapEName() {
  return `${t("save_default_name_prefix")} ${new Date().toLocaleString(getUiLocale(), {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function updatePresetEmojiLabels() {
  ui.preset1Emoji.textContent = emotionEmojiForEyes(PRESET_EXAMPLE_1.eyes);
  ui.preset2Emoji.textContent = emotionEmojiForEyes(PRESET_EXAMPLE_2.eyes);
  ui.preset3Emoji.textContent = emotionEmojiForEyes(PRESET_EXAMPLE_3.eyes);
}

function emotionEmojiForEyes(eyes) {
  if (eyes === "love") {
    return "😍";
  }
  if (eyes === "happy") {
    return "😄";
  }
  if (eyes === "wink") {
    return "😉";
  }
  if (eyes === "stars") {
    return "🤩";
  }
  if (eyes === "error") {
    return "😵";
  }
  if (eyes === "loading") {
    return "😶";
  }
  return "🙂";
}

function toLabel(value) {
  if (value === "light") {
    return t("label_light");
  }
  if (value === "dark") {
    return t("label_dark");
  }
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function toSlug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function buildInitials(value) {
  const cleaned = String(value || "")
    .trim()
    .replace(/\s+/g, " ");
  if (!cleaned) {
    return "CV";
  }
  const parts = cleaned.split(" ");
  if (parts.length === 1) {
    const chunk = parts[0].replace(/[^a-zA-Z0-9]/g, "");
    return (chunk.slice(0, 2) || "CV").toUpperCase();
  }
  const first = parts[0].charAt(0);
  const second = parts[1].charAt(0);
  return `${first}${second}`.toUpperCase();
}

function fmt(value) {
  return String(Number(value.toFixed(6)));
}

function similarityFromTwoPoints(src1, src2, dst1, dst2) {
  const srcDx = src2.x - src1.x;
  const srcDy = src2.y - src1.y;
  const dstDx = dst2.x - dst1.x;
  const dstDy = dst2.y - dst1.y;

  const srcLen = Math.hypot(srcDx, srcDy);
  const dstLen = Math.hypot(dstDx, dstDy);

  const scale = dstLen / srcLen;
  const srcAngle = Math.atan2(srcDy, srcDx);
  const dstAngle = Math.atan2(dstDy, dstDx);
  const angle = dstAngle - srcAngle;

  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const a = scale * cos;
  const b = scale * sin;
  const c = -scale * sin;
  const d = scale * cos;

  const e = dst1.x - (a * src1.x + c * src1.y);
  const f = dst1.y - (b * src1.x + d * src1.y);

  return { a, b, c, d, e, f };
}

function composeMatrices(m1, m2) {
  return {
    a: m1.a * m2.a + m1.c * m2.b,
    b: m1.b * m2.a + m1.d * m2.b,
    c: m1.a * m2.c + m1.c * m2.d,
    d: m1.b * m2.c + m1.d * m2.d,
    e: m1.a * m2.e + m1.c * m2.f + m1.e,
    f: m1.b * m2.e + m1.d * m2.f + m1.f,
  };
}

function downloadSvgMarkup(svgMarkup, fileName) {
  const blob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
  downloadBlob(blob, fileName);
}

async function trackExportEvent(format) {
  if (!supabaseReady || !supabase) {
    return;
  }
  if (!currentUser?.id) {
    return;
  }

  const normalized = format === "jpg" ? "jpg" : "png";

  const { error } = await supabase.from(DB_TABLE_EXPORT_EVENTS).insert({
    user_id: currentUser.id,
    format: normalized,
  });

  if (error) {
    console.warn("trackExportEvent failed", error);
  }
}

async function exportPngFromSvgMarkup(svgMarkup, fileName) {
  const svgBlob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const image = await loadImage(svgUrl);
    const scale = 8;

    const canvas = document.createElement("canvas");
    canvas.width = SCENE.width * scale;
    canvas.height = SCENE.height * scale;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Contexte canvas indisponible");
    }

    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, SCENE.width, SCENE.height);
    ctx.drawImage(image, 0, 0, SCENE.width, SCENE.height);

    const pngBlob = await canvasToBlob(canvas, "image/png");
    downloadBlob(pngBlob, fileName);
    void trackExportEvent("png");
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

async function exportJpgFromSvgMarkup(svgMarkup, fileName) {
  const svgBlob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const image = await loadImage(svgUrl);
    const scale = 8;

    const canvas = document.createElement("canvas");
    canvas.width = SCENE.width * scale;
    canvas.height = SCENE.height * scale;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Contexte canvas indisponible");
    }

    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    // JPEG doesn't support transparency, so we export on a white background.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, SCENE.width, SCENE.height);

    ctx.drawImage(image, 0, 0, SCENE.width, SCENE.height);

    const jpgBlob = await canvasToBlob(canvas, "image/jpeg", 0.92);
    downloadBlob(jpgBlob, fileName);
    void trackExportEvent("jpg");
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Impossible de charger l'image"));
    image.src = src;
  });
}

function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Echec de creation de l'image"));
        return;
      }
      resolve(blob);
    }, mimeType, quality);
  });
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function buildFileStem(config) {
  const timestamp = new Date().toISOString().replace(/[.:]/g, "-");
  return [config.skin, config.leftArm, config.rightArm, config.eyes, config.head, timestamp]
    .map(toSlug)
    .join("-");
}

function setGeneratorInteractive(enabled) {
  const controls = [
    ui.skin,
    ui.leftArm,
    ui.rightArm,
    ui.eyes,
    ui.head,
    ui.shadow,
    ui.preset1,
    ui.preset2,
    ui.preset3,
    ui.saveMenuTrigger,
    ui.saveActionSvg,
    ui.saveActionPng,
    ui.saveActionJpg,
    ui.saveActionLibrary,
    ui.saveModalName,
    ui.saveCancel,
    ui.pickerSkinTrigger,
    ui.pickerLeftArmTrigger,
    ui.pickerRightArmTrigger,
    ui.pickerEyesTrigger,
    ui.pickerHeadTrigger,
  ];

  for (const element of controls) {
    element.disabled = !enabled;
  }
}

function setPresetButtonMeta(button, label) {
  if (!button) {
    return;
  }
  button.setAttribute("aria-label", label);
  button.setAttribute("title", label);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
