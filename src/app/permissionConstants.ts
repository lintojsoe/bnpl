export enum PermissionConstants {
    ContractList = 'get_contract-list',
    CreateContract = 'create_contract-list',
    ContractDetail = 'get_contract-detail', // view
    UpdateContract = 'update_contract-detail',
    DeleteContract = 'delete_contract-detail',
    StaffDetail = 'get_staff_contract-detail', // not used
    CustomerList = 'get_customer-list',
    CustomerDetail = 'get_customer-detail', // not used
    CreateCustomer = 'create_customer-list',
    UpdateCustomer = 'update_customer-detail',
    DeleteCustomer = 'delete_customer-detail', // not
    CustomerDownload = 'get_customer-download',
    MerchantList = 'get_account-list',
    CreateMerchant = 'create_account-list',
    UpdateMerchant = 'update_account-detail',
    AssignStaffMerchant = 'account-assign-staff',
    DeleteMerchant = 'delete_account-detail', // not
    StaffContractList = 'get_staff_contract-list',
    StaffContractDownload = 'get_staff_contract-download',
    PayoutList = 'get_payout_report-list',
    PayoutReportDownload = 'get_payout_report-download',
    PayoutDetail = 'get_payout_report-detail',
    CreatePayout = 'create_payout_report-list', //transfer btn
    UpdatePayout = 'update_payout_report-detail',
    ContractPaymentList = 'get_contract_payment-list',
    ContarctPaymentDownload = 'get_contract_payment-download',
    CreateStaffUser = 'create_staff-list',
    UpdateStaffUSer = 'update_staff-detail',
    StaffUserList = 'get_staff-list',
    DeleteStaffUser = 'delete_staff-detail',
    StaffUserUpdateStatus = 'staff-update-status',
    MerchantUserCreate = 'create_account_staff-list',
    MerchantUserUpdate = 'update_account_staff-detail',
    MerchantUserList = 'get_account_staff-list',
    MerchantUserDelete = 'delete_account_staff-detail',
    MerchantUserUpdateStatus = 'account_staff-update-status',
    SendNotification = 'send_notification',
    RoleList = 'get_role-list',
    CreateRole = 'create_role-list',
    RoleDetails = 'get_role-detail',
    UpdateRole = 'update_role-detail',
    changePassword = 'change_password',
    BankNameList = 'get_bank_name-list',
    BankNameDetails = 'get_bank_name-detail',
    BankNameUpdate = 'update_bank_name-detail',
    BankNameCreate = 'create_bank_name-list',
    BankNameDelete = 'delete_bank_name-detail',
    CategoryList = 'get_business_category-list',
    CategoryCreate = 'create_business_category-list',
    CategoryUpdate = 'update_business_category-detail',
    CategoryDetail = 'get_business_category-detail',
    CategoryDelete = 'delete_business_category-detail',
    SalesReportDownload = 'get_sales_report-download',
    ProductReportDownload = 'get_products_report-download',
    SalesList = 'get_sales_report-list',
    ProductReport = 'get_products_report-list',
}

export class PermissionWithNavigation {
    permissionDetails = {
        contract: 'get_contract-list',
        manageUsers: '',
        customers: 'get_customer-list',
        merchants: 'get_account-list',
        payout_reports: {},
        reports: {},
        merchant_reports: {},
        role_permissions: 'get_role-list',
        settings: {},
    };
    navItems = [
        'contract',
        'manageUsers',
        'customers',
        'merchants',
        'payout_reports',
        'reports',
        'role_permissions',
        'settings',
        'merchant_reports',
    ];

    multiplePermission = {
        reports: {
            contractReport: PermissionConstants.StaffContractList,
            contractPaymentReport: PermissionConstants.ContractPaymentList,
            payoutReport: PermissionConstants.PayoutList,
        },
        merchant_reports: {
            salesReport: PermissionConstants.SalesList,
            productReport: PermissionConstants.ProductReport,
        },
        manageUsers: {
            manageUsersMerchant: PermissionConstants.MerchantUserList,
            manageUsersBank: PermissionConstants.StaffUserList,
        },
        settings: {
            bankNameList: PermissionConstants.BankNameList,
            categoryList: PermissionConstants.CategoryList,
        },
    };
}

export enum SettingsNavEnum {
    GeneralSettings = 'general_settings',
    BankName = 'bank_name',
    BusinessCategory = 'business_category',
}
