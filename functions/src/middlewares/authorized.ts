export const grants = {
  CTVban: {
    "/export/update": {
      "update:any": ["*"],
    },
    "/export/{export_id}": {
      "read:any": ["*"],
    },
    "/product": {
      "create:any": ["*"],
      "read:any": ["*"],
      "update:any": ["*"],
    },
    "/product/get-all": {
      "read:any": ["*"],
    },
    "/product/get-by-id": {
      "read:any": ["*"],
    },
    "/receipt": {
      "read:any": ["*"],
    },
    "/receipt/{receipt_id}": {
      "read:any": ["*"],
    },
    "/sell/add-transactions": {
      "create:any": ["*"],
    },
    "/sell/create": {
      "create:any": ["*"],
    },
    "/sell/create-receipt": {
      "create:any": ["*"],
    },
    "/sell/create-single": {
      "create:any": ["*"],
    },
    "/sell/get-by-ids": {
      "create:any": ["*"],
      "read:any": ["*"],
    },
    "/sell/get-by-status": {
      "read:any": ["*"],
    },
    "/sell/get-owe-sells": {
      "read:any": ["*"],
    },
    "/sell/reconciliation": {
      "update:any": ["*"],
    },
    "/sell/update": {
      "update:any": ["*"],
    },
    "/user/transfer-to-wallet": {
      "create:any": ["*"],
    },
  },
  CTVmua: {
    "/buy": {
      "create:any": ["*"],
      "read:any": ["*"],
      "update:any": ["*"],
    },
    "/buy/get-by-ids": {
      "read:any": ["*"],
    },
    "/product": {
      "create:any": ["*"],
      "read:any": ["*"],
      "update:any": ["*"],
    },
    "/product/get-all": {
      "read:any": ["*"],
    },
    "/product/get-by-id": {
      "read:any": ["*"],
    },
  },
  admin: {
    // tslint:disable-next-line: object-literal-key-quotes
    $extend: ["anonymous"],
    "/sell/get-by-ids": {
      "read:any": ["*"],
    },
    "/user/get-all": {
      "read:any": ["*"],
      // "update:any": ["id"],
    },
    "/user/update-role": {
      "update:any": ["*"],
    },
  },
  anonymous: {
    "/sell/backup": {
      "create:any": ["*"],
    },
    "/sell/get-by-status": {
      "read:any": ["*"],
    },
    "/sell/update": {
      "update:any": ["*"],
    },
    "/user/create": {
      "create:any": ["*"],
    },
  },
  quanlyCTVban: {
    "/export/{export_id}": {
      "read:any": ["*"],
    },
    "/product": {
      "create:any": ["*"],
      "delete:any": ["*"],
      "read:any": ["*"],
      "update:any": ["*"],
    },
    "/product/delete/{product_id}": {
      "read:any": ["*"],
    },
    "/product/get-all": {
      "read:any": ["*"],
    },
    "/product/get-by-id": {
      "read:any": ["*"],
    },
    "/sell/get-by-ids": {
      "create:any": ["*"],
      "read:any": ["*"],
    },
    "/sell/get-by-status": {
      "read:any": ["*"],
    },
    "/sell/update": {
      "update:any": ["*"],
    },
    "/user/add-ctv": {
      "create:any": ["*"],
    },
    "/user/approve-trans": {
      "update:any": ["*"],
    },
    "/user/delete-ctv": {
      "delete:any": ["*"],
    },
    "/user/get-ctv": {
      "read:any": ["*"],
    },
    "/user/update-role": {
      "update:any": ["*"],
    },
  },
  quanlyCTVmua: {
    "/buy": {
      "read:any": ["*"],
      "update:any": ["*"],
    },
    "/buy-model": {
      "read:any": ["*"],
      "update:any": ["*"],
    },
    "/buy-model/gomdon-buy-id/{gomdon_buy_id}": {
      "read:any": ["*"],
    },
    "/buy/get-all": {
      "read:any": ["*"],
    },
    "/buy/get-by-ids": {
      "read:any": ["*"],
    },
    "/buy/get-by-status": {
      "read:any": ["*"],
    },
    "/export/add-snapshot": {
      "create:any": ["*"],
    },
    "/product": {
      "create:any": ["*"],
      "read:any": ["*"],
      "update:any": ["*"],
    },
    "/product/get-all": {
      "read:any": ["*"],
    },
    "/product/get-by-id": {
      "read:any": ["*"],
    },
    "/user/add-ctv": {
      "create:any": ["*"],
    },
    "/user/delete-ctv": {
      "delete:any": ["*"],
    },
    "/user/get-ctv": {
      "read:any": ["*"],
    },
    "/user/update-role": {
      "update:any": ["*"],
    },
  },
  quanlykho: {
    // tslint:disable-next-line: object-literal-key-quotes
    $extend: ["CTVban"],
    "/buy": {
      "create:any": ["*"],
      "read:any": ["*"],
      "update:any": ["*"],
    },
    "/buy-model": {
      "read:any": ["*"],
      "update:any": ["*"],
    },
    "/buy-model/gomdon-buy-id/{gomdon_buy_id}": {
      "read:any": ["*"],
    },
    "/buy/get-all": {
      "read:any": ["*"],
    },
    "/buy/get-by-ids": {
      "read:any": ["*"],
    },
    "/buy/get-by-status": {
      "read:any": ["*"],
    },
    "/export/add-snapshot": {
      "create:any": ["*"],
    },
    "/export/create": {
      "create:any": ["*"],
    },
    "/export/get-by-status": {
      "read:any": ["*"],
    },
    "/export/update": {
      "update:any": ["*"],
    },
    "/export/{export_id}": {
      "read:any": ["*"],
    },
    "/product": {
      "create:any": ["*"],
      "read:any": ["*"],
      "update:any": ["*"],
    },
    "/product/get-all": {
      "read:any": ["*"],
    },
    "/product/get-by-id": {
      "read:any": ["*"],
    },
    "/sell/create-receipt": {
      "create:any": ["*"],
    },
    "/sell/create-single": {
      "create:any": ["*"],
    },
    "/sell/get-by-ids": {
      "create:any": ["*"],
      "read:any": ["*"],
    },
    "/sell/get-by-status": {
      "read:any": ["*"],
    },
    "/sell/get-owe-sells": {
      "read:any": ["*"],
    },
    "/sell/reconciliation": {
      "update:any": ["*"],
    },
    "/sell/update": {
      "update:any": ["*"],
    },
    "/user/add-ctv": {
      "create:any": ["*"],
    },
    "/user/add-quanlyctv": {
      "create:any": ["*"],
    },
    "/user/delete-ctv": {
      "delete:any": ["*"],
    },
    "/user/get-ctv": {
      "read:any": ["*"],
    },
    "/user/update-role": {
      "update:any": ["*"],
    },
  },
};
