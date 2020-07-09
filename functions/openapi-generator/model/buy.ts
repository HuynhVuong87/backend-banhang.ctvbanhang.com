/**
 * Gom Don API
 * Gom Don API.
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { BuyGomdonBy } from './buyGomdonBy';
import { BuyProduct } from './buyProduct';
import { GomdonLogs } from './gomdonLogs';


export interface Buy { 
    gomdon_by?: BuyGomdonBy;
    gomdon_logs?: Array<GomdonLogs>;
    /**
     * Mảng các id sản phẩm được lấy trên trang 1688. Mảng này được lấy ra từ BuyModel để biết đơn mua này có mấy sản phẩm và nó là sản phầm gì
     */
    gomdon_product_ids?: Array<string>;
    /**
     * Giá phải trả cho nhà bán (Không tính giá phát sinh như phí vận chuyển ...) Được tính từ bảng buyModel
     */
    origin_price?: number;
    product?: BuyProduct;
    /**
     * Đơn vị tiền tệ (lấy trên 1688)
     */
    currency?: string;
    /**
     * Tỉ giá
     */
    currency_rate?: number;
    note?: string;
    /**
     * Phí ship từ nhà bán bên trung quốc về kho trung gian bên trung quốc(được lấy trên đơn mua 1688)
     */
    shipping_fee: number;
    /**
     * Số tiền được giảm (được lấy trên 1688)
     */
    voucher_price?: number;
    shipping_traceId?: Array<string>;
    status?: number;
    /**
     * Tên nhà bán trên 1688
     */
    company_name: string;
    gomdon_ctime?: number;
    /**
     * Id document do mình quản lý
     */
    gomdon_id?: string;
    /**
     * Id của đơn mua trên 1688
     */
    buy_id?: string;
}

