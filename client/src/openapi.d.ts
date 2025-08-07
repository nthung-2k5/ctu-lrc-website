import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios';

declare namespace Components {
    namespace Parameters {
        export type BookId = string;
    }
    export interface PathParameters {
        bookId: Parameters.BookId;
    }
    namespace Responses {
        export interface BadRequest {
            message: string;
            errors?: {
                message: string;
            }[];
        }
        export type NoContent = null;
        export interface NotFound {
            message: string;
        }
    }
    namespace Schemas {
        /**
         *
         */
        export interface Book {
            title: string;
            ISBN: string;
            price?: number;
            copiesCount?: number;
            author: string;
            pageCount: number;
            genre?: string[];
            summary?: string;
            publicationYear: number;
            publisher: {
                id: string;
                name: string;
            };
            id: string;
        }
        /**
         *
         */
        export interface BookData {
            title: string;
            ISBN: string;
            price?: number;
            copiesCount?: number;
            author: string;
            pageCount: number;
            genre?: string[];
            summary?: string;
            publicationYear: number;
            publisher: string;
        }
        /**
         *
         */
        export interface BookSearchResult {
            id: string;
            title: string;
            author: string;
        }
        /**
         *
         */
        export interface BookWithId {
            title: string;
            ISBN: string;
            price?: number;
            copiesCount?: number;
            author: string;
            pageCount: number;
            genre?: string[];
            summary?: string;
            publicationYear: number;
            publisher: {
                id: string;
                name: string;
            };
            id: string;
        }
        /**
         *
         */
        export interface Borrow {
            id: string;
            reader: /*  */ Reader;
            book: /*  */ Book;
            borrowDate: string; // date-time
            dueDate: string; // date-time
            returnDate?: string | null; // date-time
            notes?: string | null;
            staff: /*  */ Staff;
            status: "returned" | "overdue" | "borrowing";
        }
        export interface Error {
            message?: string;
            error?: string;
        }
        /**
         *
         */
        export interface HoldRequest {
            id: string;
            reader: /*  */ Reader;
            book: /*  */ Book;
            holdDate: string; // date-time
            expiryDate: string; // date-time
        }
        /**
         *
         */
        export interface LoginRequest {
            identifier: string;
            password: string;
        }
        /**
         *
         */
        export interface PublicBook {
            title: string;
            ISBN: string;
            author: string;
            pageCount: number;
            genre?: string[];
            summary?: string;
            publicationYear: number;
            publisher: string;
            id: string;
            status: "available" | "borrowing" | "holding" | "unavailable";
        }
        /**
         *
         */
        export interface Publisher {
            name: string;
            address: string;
            phone: string; // ^\d{10,11}$
            email?: string; // email
            website?: string;
            titleCount: number;
            id: string;
        }
        /**
         *
         */
        export interface PublisherData {
            name: string;
            address: string;
            phone: string; // ^\d{10,11}$
            email?: string; // email
            website?: string;
        }
        /**
         *
         */
        export interface Reader {
            lastName: string;
            firstName: string;
            dateOfBirth?: string; // date
            gender: "M" | "F" | "Other";
            address?: string;
            phone: string;
            email: string;
            password: string;
            id: string;
            code: string;
        }
        /**
         *
         */
        export interface ReaderData {
            lastName: string;
            firstName: string;
            dateOfBirth?: string; // date
            gender: "M" | "F" | "Other";
            address?: string;
            phone: string;
            email: string;
            password: string;
        }
        /**
         *
         */
        export interface ReaderProfile {
            lastName: string;
            firstName: string;
            dateOfBirth?: string; // date
            gender: "M" | "F" | "Other";
            address?: string;
            phone: string;
        }
        /**
         *
         */
        export interface SimpleBook {
            id: string;
            title: string;
            status: "available" | "borrowing" | "holding" | "unavailable";
            publicationYear: number;
        }
        /**
         *
         */
        export interface SimplePublisher {
            id: string;
            name: string;
        }
        /**
         *
         */
        export interface Staff {
            username: string;
            name: string;
            role: "admin" | "staff";
            address?: string;
            phone?: string;
            password: string;
            id: string;
        }
        /**
         *
         */
        export interface StaffData {
            username: string;
            name: string;
            role: "admin" | "staff";
            address?: string;
            phone?: string;
            password: string;
        }
    }
}
declare namespace Paths {
    namespace AcceptBorrowFromHoldRequests {
        export interface RequestBody {
            holdId: string;
            dueDate?: string;
        }
    }
    namespace BorrowBook {
        export interface RequestBody {
            readerId: string;
            bookId: string;
            dueDate?: string;
            notes?: string;
        }
        namespace Responses {
            export type $201 = /*  */ Components.Schemas.Borrow;
            export type $400 = Components.Responses.BadRequest;
            export interface $401 {
                message: string;
            }
        }
    }
    namespace CancelReaderHoldRequest {
        namespace Parameters {
            export type BookId = string;
        }
        export interface PathParameters {
            bookId: Parameters.BookId;
        }
        namespace Responses {
            export interface $204 {
            }
            export type $401 = Components.Schemas.Error;
            export type $404 = Components.Schemas.Error;
        }
    }
    namespace CreateBook {
        export type RequestBody = /*  */ Components.Schemas.BookData;
        namespace Responses {
            export type $201 = /*  */ Components.Schemas.BookWithId;
            export type $400 = Components.Schemas.Error;
            export type $401 = Components.Schemas.Error;
        }
    }
    namespace CreatePublisher {
        export type RequestBody = /*  */ Components.Schemas.PublisherData;
        namespace Responses {
            /**
             * CreatePublisherCreated
             */
            export interface $201 {
                id: string;
            }
            export type $400 = Components.Schemas.Error;
            export type $401 = Components.Schemas.Error;
        }
    }
    namespace CreateReaderHoldRequest {
        namespace Parameters {
            export type BookId = string;
        }
        export interface PathParameters {
            bookId: Parameters.BookId;
        }
        namespace Responses {
            export type $201 = /*  */ Components.Schemas.HoldRequest;
            export type $400 = Components.Schemas.Error;
            export type $401 = Components.Schemas.Error;
        }
    }
    namespace CreateStaff {
        export type RequestBody = /*  */ Components.Schemas.StaffData;
        namespace Responses {
            export type $201 = /*  */ Components.Schemas.Staff;
            export type $400 = Components.Schemas.Error;
            export type $401 = Components.Schemas.Error;
            export type $403 = Components.Schemas.Error;
        }
    }
    namespace DeleteBook {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $204 {
            }
            export type $401 = Components.Schemas.Error;
        }
    }
    namespace DeletePublisher {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $204 {
            }
            export type $401 = Components.Schemas.Error;
        }
    }
    namespace DeleteReaderById {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $204 {
            }
            export type $401 = Components.Schemas.Error;
            export type $404 = Components.Schemas.Error;
        }
    }
    namespace DeleteStaff {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $204 {
            }
            export type $401 = Components.Schemas.Error;
            export type $403 = Components.Schemas.Error;
        }
    }
    namespace GetAllBorrows {
        namespace Responses {
            export type $200 = /*  */ Components.Schemas.Borrow[];
        }
    }
    namespace GetAllGenres {
        namespace Responses {
            /**
             * GetAllGenresOk
             */
            export type $200 = string[];
        }
    }
    namespace GetAllHoldRequests {
        namespace Responses {
            export type $200 = /*  */ Components.Schemas.HoldRequest[];
        }
    }
    namespace GetBookById {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export type $200 = /*  */ Components.Schemas.PublicBook;
            export type $404 = string;
        }
    }
    namespace GetBooks {
        namespace Parameters {
            export type Genre = string[];
            export type PublicationYear = number[];
            export type Publisher = string[];
        }
        export interface QueryParameters {
            publisher?: Parameters.Publisher;
            genre?: Parameters.Genre;
            publicationYear?: Parameters.PublicationYear;
        }
        namespace Responses {
            export type $200 = /*  */ Components.Schemas.Book[];
        }
    }
    namespace GetHoldRequestByBookCopyId {
        namespace Parameters {
            export type BookCopyId = string;
        }
        export interface PathParameters {
            bookCopyId: Parameters.BookCopyId;
        }
        namespace Responses {
            export type $200 = /*  */ Components.Schemas.HoldRequest;
            export type $401 = Components.Schemas.Error;
            export type $404 = Components.Schemas.Error;
        }
    }
    namespace GetPublisherById {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export type $200 = /*  */ Components.Schemas.Publisher;
            export type $404 = Components.Schemas.Error;
        }
    }
    namespace GetPublishers {
        namespace Responses {
            /**
             * GetAllPublishersOk
             */
            export type $200 = /* GetAllPublishersOk */ /*  */ Components.Schemas.Publisher[] | /*  */ Components.Schemas.SimplePublisher[];
        }
    }
    namespace GetReaderBorrowHistory {
        namespace Responses {
            export type $200 = /*  */ Components.Schemas.Borrow[];
            export interface $401 {
                message: string;
            }
            export interface $403 {
                message: string;
            }
        }
    }
    namespace GetReaderById {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export type $200 = /*  */ Components.Schemas.Reader;
            export type $401 = Components.Schemas.Error;
            export type $404 = Components.Schemas.Error;
        }
    }
    namespace GetReaderHoldRequests {
        namespace Responses {
            /**
             * GetReaderHoldsOk
             */
            export type $200 = /*  */ Components.Schemas.HoldRequest[];
            export type $401 = Components.Schemas.Error;
        }
    }
    namespace GetReaderProfile {
        namespace Responses {
            export type $200 = /*  */ Components.Schemas.ReaderData;
            export type $204 = Components.Responses.NoContent;
            export type $401 = Components.Schemas.Error;
        }
    }
    namespace GetReaders {
        namespace Responses {
            /**
             * GetAllReadersOk
             */
            export type $200 = /*  */ Components.Schemas.Reader[];
            export type $401 = Components.Schemas.Error;
        }
    }
    namespace GetStaffById {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export type $200 = /*  */ Components.Schemas.Staff;
            export type $401 = Components.Schemas.Error;
            export type $403 = Components.Schemas.Error;
            export type $404 = Components.Schemas.Error;
        }
    }
    namespace GetStaffProfile {
        namespace Responses {
            export type $200 = /*  */ Components.Schemas.Staff;
            export type $204 = Components.Responses.NoContent;
            export interface $401 {
                message: string;
            }
            export interface $403 {
                message: string;
            }
        }
    }
    namespace GetStaffs {
        namespace Responses {
            /**
             * GetAllStaffOk
             */
            export type $200 = /*  */ Components.Schemas.Staff[];
            export type $401 = Components.Schemas.Error;
            export type $403 = Components.Schemas.Error;
        }
    }
    namespace LoginAsReader {
        export type RequestBody = /*  */ Components.Schemas.LoginRequest;
        namespace Responses {
            export type $204 = Components.Responses.NoContent;
            export type $400 = Components.Responses.BadRequest;
            export interface $401 {
                message: string;
            }
            export type $404 = Components.Responses.NotFound;
        }
    }
    namespace LoginAsStaff {
        export type RequestBody = /*  */ Components.Schemas.LoginRequest;
        namespace Responses {
            export type $204 = Components.Responses.NoContent;
            export type $400 = Components.Responses.BadRequest;
            export interface $401 {
                message: string;
            }
            export type $404 = Components.Responses.NotFound;
        }
    }
    namespace Logout {
        namespace Responses {
            export type $204 = Components.Responses.NoContent;
        }
    }
    namespace RegisterReader {
        export type RequestBody = /*  */ Components.Schemas.ReaderData;
        namespace Responses {
            export type $201 = /*  */ Components.Schemas.ReaderData;
            export type $400 = Components.Schemas.Error;
        }
    }
    namespace ReturnBook {
        namespace Parameters {
            export type BorrowId = string;
        }
        export interface QueryParameters {
            borrowId: Parameters.BorrowId;
        }
        namespace Responses {
            /**
             * TrảSachNoContent
             */
            export type $204 = null;
            /**
             * TrảSachUnauthorized
             */
            export interface $401 {
                message: string;
            }
        }
    }
    namespace SearchBooks {
        namespace Parameters {
            export type Query = string;
        }
        export interface QueryParameters {
            query: Parameters.Query;
        }
        namespace Responses {
            /**
             * SearchBooksOk
             */
            export type $200 = /*  */ Components.Schemas.BookSearchResult[];
        }
    }
    namespace UpdateBook {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export type RequestBody = /*  */ Components.Schemas.BookData;
        namespace Responses {
            export type $200 = /*  */ Components.Schemas.Book;
            export type $400 = Components.Schemas.Error;
            export type $401 = Components.Schemas.Error;
            export type $404 = Components.Schemas.Error;
        }
    }
    namespace UpdatePublisher {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export type RequestBody = /*  */ Components.Schemas.PublisherData;
        namespace Responses {
            export type $200 = /*  */ Components.Schemas.Publisher;
            export type $400 = Components.Schemas.Error;
            export type $401 = Components.Schemas.Error;
            export type $404 = Components.Schemas.Error;
        }
    }
    namespace UpdateReaderById {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export type RequestBody = /*  */ Components.Schemas.ReaderData;
        namespace Responses {
            export type $200 = /*  */ Components.Schemas.ReaderData;
            export type $400 = Components.Schemas.Error;
            export type $401 = Components.Schemas.Error;
            export type $404 = Components.Schemas.Error;
        }
    }
    namespace UpdateReaderProfile {
        export type RequestBody = /*  */ Components.Schemas.ReaderProfile;
        namespace Responses {
            export type $200 = /*  */ Components.Schemas.ReaderProfile;
            export type $400 = Components.Schemas.Error;
            export type $401 = Components.Schemas.Error;
        }
    }
    namespace UpdateStaff {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export type RequestBody = /*  */ Components.Schemas.StaffData;
        namespace Responses {
            export type $200 = /*  */ Components.Schemas.Staff;
            export type $400 = Components.Schemas.Error;
            export type $401 = Components.Schemas.Error;
            export type $403 = Components.Schemas.Error;
            export type $404 = Components.Schemas.Error;
        }
    }
}


export interface OperationMethods {
  /**
   * getBooks - Get books
   * 
   * Lấy danh sách tất cả sách trong thư viện
   */
  'getBooks'(
    parameters?: Parameters<Paths.GetBooks.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetBooks.Responses.$200>
  /**
   * createBook - Create book
   * 
   * Thêm sách mới vào thư viện (Chỉ nhân viên)
   */
  'createBook'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateBook.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateBook.Responses.$201>
  /**
   * getBookById - Get book by ID
   * 
   * Lấy thông tin chi tiết của một cuốn sách theo ID
   */
  'getBookById'(
    parameters?: Parameters<Paths.GetBookById.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetBookById.Responses.$200>
  /**
   * updateBook - Update book
   * 
   * Cập nhật thông tin sách (Chỉ nhân viên)
   */
  'updateBook'(
    parameters?: Parameters<Paths.UpdateBook.PathParameters> | null,
    data?: Paths.UpdateBook.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.UpdateBook.Responses.$200>
  /**
   * deleteBook - Delete book
   * 
   * Xóa sách khỏi thư viện (Chỉ nhân viên)
   */
  'deleteBook'(
    parameters?: Parameters<Paths.DeleteBook.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteBook.Responses.$204>
  /**
   * getReaders - Get readers
   * 
   * Lấy danh sách tất cả độc giả (Chỉ nhân viên)
   */
  'getReaders'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetReaders.Responses.$200>
  /**
   * registerReader - Register reader
   * 
   * Đăng ký tài khoản độc giả mới
   */
  'registerReader'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.RegisterReader.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.RegisterReader.Responses.$201>
  /**
   * getReaderProfile - Get reader profile
   * 
   * Xem thông tin cá nhân của độc giả hiện tại
   */
  'getReaderProfile'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetReaderProfile.Responses.$200 | Paths.GetReaderProfile.Responses.$204>
  /**
   * updateReaderProfile - Update reader profile
   * 
   * Cập nhật thông tin cá nhân của độc giả hiện tại
   */
  'updateReaderProfile'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.UpdateReaderProfile.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.UpdateReaderProfile.Responses.$200>
  /**
   * getHoldRequestByBookCopyId - Kiểm tra yêu cầu giữ sách
   * 
   * Kiểm tra xem độc giả có yêu cầu giữ sách cho bản sao sách cụ thể không
   */
  'getHoldRequestByBookCopyId'(
    parameters?: Parameters<Paths.GetHoldRequestByBookCopyId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetHoldRequestByBookCopyId.Responses.$200>
  /**
   * getReaderById - Get reader by ID
   * 
   * Get a specific reader by ID (Staff only)
   */
  'getReaderById'(
    parameters?: Parameters<Paths.GetReaderById.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetReaderById.Responses.$200>
  /**
   * updateReaderById - Update reader
   * 
   * Update a reader (Staff only)
   */
  'updateReaderById'(
    parameters?: Parameters<Paths.UpdateReaderById.PathParameters> | null,
    data?: Paths.UpdateReaderById.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.UpdateReaderById.Responses.$200>
  /**
   * deleteReaderById - Delete reader
   * 
   * Delete a reader (Staff only)
   */
  'deleteReaderById'(
    parameters?: Parameters<Paths.DeleteReaderById.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteReaderById.Responses.$204>
  /**
   * getPublishers - Get publishers
   * 
   * Lấy danh sách tất cả nhà xuất bản
   */
  'getPublishers'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetPublishers.Responses.$200>
  /**
   * createPublisher - Create publisher
   * 
   * Thêm nhà xuất bản mới (Chỉ nhân viên)
   */
  'createPublisher'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreatePublisher.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreatePublisher.Responses.$201>
  /**
   * getPublisherById - Get publisher by ID
   * 
   * Get a specific publisher by its ID
   */
  'getPublisherById'(
    parameters?: Parameters<Paths.GetPublisherById.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetPublisherById.Responses.$200>
  /**
   * updatePublisher - Update publisher
   * 
   * Update a publisher (Staff only)
   */
  'updatePublisher'(
    parameters?: Parameters<Paths.UpdatePublisher.PathParameters> | null,
    data?: Paths.UpdatePublisher.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.UpdatePublisher.Responses.$200>
  /**
   * deletePublisher - Delete publisher
   * 
   * Delete a publisher (Staff only)
   */
  'deletePublisher'(
    parameters?: Parameters<Paths.DeletePublisher.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeletePublisher.Responses.$204>
  /**
   * getStaffs - Get staffs
   * 
   * Get a list of all staff members (Admin only)
   */
  'getStaffs'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetStaffs.Responses.$200>
  /**
   * createStaff - Create staff
   * 
   * Create a new staff member (Admin only)
   */
  'createStaff'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateStaff.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateStaff.Responses.$201>
  /**
   * getStaffById - Get staff by ID
   * 
   * Get a specific staff member by ID (Admin only)
   */
  'getStaffById'(
    parameters?: Parameters<Paths.GetStaffById.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetStaffById.Responses.$200>
  /**
   * updateStaff - Update staff
   * 
   * Update a staff member (Admin only)
   */
  'updateStaff'(
    parameters?: Parameters<Paths.UpdateStaff.PathParameters> | null,
    data?: Paths.UpdateStaff.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.UpdateStaff.Responses.$200>
  /**
   * deleteStaff - Delete staff
   * 
   * Delete a staff member (Admin only)
   */
  'deleteStaff'(
    parameters?: Parameters<Paths.DeleteStaff.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteStaff.Responses.$204>
  /**
   * getAllGenres - Get all genres
   */
  'getAllGenres'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetAllGenres.Responses.$200>
  /**
   * loginAsStaff - Login as staff
   * 
   * Xác thực đăng nhập cho nhân viên thư viện
   */
  'loginAsStaff'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.LoginAsStaff.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.LoginAsStaff.Responses.$204>
  /**
   * loginAsReader - Login as reader
   * 
   * Xác thực đăng nhập cho độc giả
   */
  'loginAsReader'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.LoginAsReader.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.LoginAsReader.Responses.$204>
  /**
   * logout - Logout
   * 
   * Đăng xuất khỏi hệ thống
   */
  'logout'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.Logout.Responses.$204>
  /**
   * searchBooks - Search books
   * 
   * Tìm kiếm sách theo tên, tác giả, ISBN, v.v.
   */
  'searchBooks'(
    parameters?: Parameters<Paths.SearchBooks.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.SearchBooks.Responses.$200>
  /**
   * getStaffProfile - Get staff profile
   */
  'getStaffProfile'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetStaffProfile.Responses.$200 | Paths.GetStaffProfile.Responses.$204>
  /**
   * createReaderHoldRequest - Create reader hold request
   * 
   * Tạo yêu cầu giữ sách cho một bản sao sách
   */
  'createReaderHoldRequest'(
    parameters?: Parameters<Paths.CreateReaderHoldRequest.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateReaderHoldRequest.Responses.$201>
  /**
   * cancelReaderHoldRequest - Cancel reader hold request
   * 
   * Hủy yêu cầu giữ sách cho một bản sao sách
   */
  'cancelReaderHoldRequest'(
    parameters?: Parameters<Paths.CancelReaderHoldRequest.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CancelReaderHoldRequest.Responses.$204>
  /**
   * getReaderHoldRequests - Get reader hold requests
   * 
   * Xem danh sách yêu cầu giữ sách của độc giả hiện tại
   */
  'getReaderHoldRequests'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetReaderHoldRequests.Responses.$200>
  /**
   * getAllBorrows - Get all borrows
   */
  'getAllBorrows'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetAllBorrows.Responses.$200>
  /**
   * borrowBook - Borrow book
   */
  'borrowBook'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.BorrowBook.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.BorrowBook.Responses.$201>
  /**
   * returnBook - Return book
   */
  'returnBook'(
    parameters?: Parameters<Paths.ReturnBook.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ReturnBook.Responses.$204>
  /**
   * getAllHoldRequests - Get all hold requests
   */
  'getAllHoldRequests'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetAllHoldRequests.Responses.$200>
  /**
   * acceptBorrowFromHoldRequests - Accept borrow from hold requests
   */
  'acceptBorrowFromHoldRequests'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.AcceptBorrowFromHoldRequests.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getReaderBorrowHistory - Get reader borrow history
   */
  'getReaderBorrowHistory'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetReaderBorrowHistory.Responses.$200>
}

export interface PathsDictionary {
  ['/books']: {
    /**
     * getBooks - Get books
     * 
     * Lấy danh sách tất cả sách trong thư viện
     */
    'get'(
      parameters?: Parameters<Paths.GetBooks.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetBooks.Responses.$200>
    /**
     * createBook - Create book
     * 
     * Thêm sách mới vào thư viện (Chỉ nhân viên)
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateBook.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateBook.Responses.$201>
  }
  ['/books/{id}']: {
    /**
     * getBookById - Get book by ID
     * 
     * Lấy thông tin chi tiết của một cuốn sách theo ID
     */
    'get'(
      parameters?: Parameters<Paths.GetBookById.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetBookById.Responses.$200>
    /**
     * updateBook - Update book
     * 
     * Cập nhật thông tin sách (Chỉ nhân viên)
     */
    'put'(
      parameters?: Parameters<Paths.UpdateBook.PathParameters> | null,
      data?: Paths.UpdateBook.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.UpdateBook.Responses.$200>
    /**
     * deleteBook - Delete book
     * 
     * Xóa sách khỏi thư viện (Chỉ nhân viên)
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteBook.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteBook.Responses.$204>
  }
  ['/readers']: {
    /**
     * getReaders - Get readers
     * 
     * Lấy danh sách tất cả độc giả (Chỉ nhân viên)
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetReaders.Responses.$200>
    /**
     * registerReader - Register reader
     * 
     * Đăng ký tài khoản độc giả mới
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.RegisterReader.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.RegisterReader.Responses.$201>
  }
  ['/readers/profile']: {
    /**
     * getReaderProfile - Get reader profile
     * 
     * Xem thông tin cá nhân của độc giả hiện tại
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetReaderProfile.Responses.$200 | Paths.GetReaderProfile.Responses.$204>
    /**
     * updateReaderProfile - Update reader profile
     * 
     * Cập nhật thông tin cá nhân của độc giả hiện tại
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.UpdateReaderProfile.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.UpdateReaderProfile.Responses.$200>
  }
  ['/readers/holds/{bookCopyId}']: {
    /**
     * getHoldRequestByBookCopyId - Kiểm tra yêu cầu giữ sách
     * 
     * Kiểm tra xem độc giả có yêu cầu giữ sách cho bản sao sách cụ thể không
     */
    'get'(
      parameters?: Parameters<Paths.GetHoldRequestByBookCopyId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetHoldRequestByBookCopyId.Responses.$200>
  }
  ['/readers/{id}']: {
    /**
     * getReaderById - Get reader by ID
     * 
     * Get a specific reader by ID (Staff only)
     */
    'get'(
      parameters?: Parameters<Paths.GetReaderById.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetReaderById.Responses.$200>
    /**
     * updateReaderById - Update reader
     * 
     * Update a reader (Staff only)
     */
    'put'(
      parameters?: Parameters<Paths.UpdateReaderById.PathParameters> | null,
      data?: Paths.UpdateReaderById.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.UpdateReaderById.Responses.$200>
    /**
     * deleteReaderById - Delete reader
     * 
     * Delete a reader (Staff only)
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteReaderById.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteReaderById.Responses.$204>
  }
  ['/publishers']: {
    /**
     * getPublishers - Get publishers
     * 
     * Lấy danh sách tất cả nhà xuất bản
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetPublishers.Responses.$200>
    /**
     * createPublisher - Create publisher
     * 
     * Thêm nhà xuất bản mới (Chỉ nhân viên)
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreatePublisher.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreatePublisher.Responses.$201>
  }
  ['/publishers/{id}']: {
    /**
     * getPublisherById - Get publisher by ID
     * 
     * Get a specific publisher by its ID
     */
    'get'(
      parameters?: Parameters<Paths.GetPublisherById.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetPublisherById.Responses.$200>
    /**
     * updatePublisher - Update publisher
     * 
     * Update a publisher (Staff only)
     */
    'put'(
      parameters?: Parameters<Paths.UpdatePublisher.PathParameters> | null,
      data?: Paths.UpdatePublisher.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.UpdatePublisher.Responses.$200>
    /**
     * deletePublisher - Delete publisher
     * 
     * Delete a publisher (Staff only)
     */
    'delete'(
      parameters?: Parameters<Paths.DeletePublisher.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeletePublisher.Responses.$204>
  }
  ['/staff']: {
    /**
     * createStaff - Create staff
     * 
     * Create a new staff member (Admin only)
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateStaff.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateStaff.Responses.$201>
    /**
     * getStaffs - Get staffs
     * 
     * Get a list of all staff members (Admin only)
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetStaffs.Responses.$200>
  }
  ['/staff/{id}']: {
    /**
     * getStaffById - Get staff by ID
     * 
     * Get a specific staff member by ID (Admin only)
     */
    'get'(
      parameters?: Parameters<Paths.GetStaffById.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetStaffById.Responses.$200>
    /**
     * updateStaff - Update staff
     * 
     * Update a staff member (Admin only)
     */
    'put'(
      parameters?: Parameters<Paths.UpdateStaff.PathParameters> | null,
      data?: Paths.UpdateStaff.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.UpdateStaff.Responses.$200>
    /**
     * deleteStaff - Delete staff
     * 
     * Delete a staff member (Admin only)
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteStaff.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteStaff.Responses.$204>
  }
  ['/books/genres']: {
    /**
     * getAllGenres - Get all genres
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetAllGenres.Responses.$200>
  }
  ['/auth/staff']: {
    /**
     * loginAsStaff - Login as staff
     * 
     * Xác thực đăng nhập cho nhân viên thư viện
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.LoginAsStaff.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.LoginAsStaff.Responses.$204>
  }
  ['/auth/reader']: {
    /**
     * loginAsReader - Login as reader
     * 
     * Xác thực đăng nhập cho độc giả
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.LoginAsReader.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.LoginAsReader.Responses.$204>
  }
  ['/auth/logout']: {
    /**
     * logout - Logout
     * 
     * Đăng xuất khỏi hệ thống
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.Logout.Responses.$204>
  }
  ['/books/search']: {
    /**
     * searchBooks - Search books
     * 
     * Tìm kiếm sách theo tên, tác giả, ISBN, v.v.
     */
    'get'(
      parameters?: Parameters<Paths.SearchBooks.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.SearchBooks.Responses.$200>
  }
  ['/staff/profile']: {
    /**
     * getStaffProfile - Get staff profile
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetStaffProfile.Responses.$200 | Paths.GetStaffProfile.Responses.$204>
  }
  ['/readers/holds/{bookId}']: {
    /**
     * createReaderHoldRequest - Create reader hold request
     * 
     * Tạo yêu cầu giữ sách cho một bản sao sách
     */
    'post'(
      parameters?: Parameters<Paths.CreateReaderHoldRequest.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateReaderHoldRequest.Responses.$201>
    /**
     * cancelReaderHoldRequest - Cancel reader hold request
     * 
     * Hủy yêu cầu giữ sách cho một bản sao sách
     */
    'delete'(
      parameters?: Parameters<Paths.CancelReaderHoldRequest.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CancelReaderHoldRequest.Responses.$204>
  }
  ['/readers/holds']: {
    /**
     * getReaderHoldRequests - Get reader hold requests
     * 
     * Xem danh sách yêu cầu giữ sách của độc giả hiện tại
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetReaderHoldRequests.Responses.$200>
  }
  ['/borrows']: {
    /**
     * getAllBorrows - Get all borrows
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetAllBorrows.Responses.$200>
    /**
     * returnBook - Return book
     */
    'delete'(
      parameters?: Parameters<Paths.ReturnBook.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ReturnBook.Responses.$204>
    /**
     * borrowBook - Borrow book
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.BorrowBook.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.BorrowBook.Responses.$201>
  }
  ['/borrows/holds']: {
    /**
     * getAllHoldRequests - Get all hold requests
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetAllHoldRequests.Responses.$200>
    /**
     * acceptBorrowFromHoldRequests - Accept borrow from hold requests
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.AcceptBorrowFromHoldRequests.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/readers/borrows']: {
    /**
     * getReaderBorrowHistory - Get reader borrow history
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetReaderBorrowHistory.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>


export type Book = Components.Schemas.Book;
export type BookData = Components.Schemas.BookData;
export type BookSearchResult = Components.Schemas.BookSearchResult;
export type BookWithId = Components.Schemas.BookWithId;
export type Borrow = Components.Schemas.Borrow;
export type Error = Components.Schemas.Error;
export type HoldRequest = Components.Schemas.HoldRequest;
export type LoginRequest = Components.Schemas.LoginRequest;
export type PublicBook = Components.Schemas.PublicBook;
export type Publisher = Components.Schemas.Publisher;
export type PublisherData = Components.Schemas.PublisherData;
export type Reader = Components.Schemas.Reader;
export type ReaderData = Components.Schemas.ReaderData;
export type ReaderProfile = Components.Schemas.ReaderProfile;
export type SimpleBook = Components.Schemas.SimpleBook;
export type SimplePublisher = Components.Schemas.SimplePublisher;
export type Staff = Components.Schemas.Staff;
export type StaffData = Components.Schemas.StaffData;
