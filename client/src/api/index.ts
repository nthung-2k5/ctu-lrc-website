import type { Client } from 'src/openapi';
import OpenAPIClientAxios from 'openapi-client-axios';

const api = new OpenAPIClientAxios({ definition: '/api/openapi.yaml' });
const client = await api.init<Client>();

export const BookApi = {
    list: client.getBooks,
    search: client.searchBooks,
    find: client.getBookById,
    create: client.createBook,
    update: client.updateBook,
    delete: client.deleteBook,
    getAllGenres: client.getAllGenres,
};

export const ReaderApi = {
    register: client.registerReader,
    getProfile: client.getReaderProfile,
    updateProfile: client.updateReaderProfile,
    list: client.getReaders,
    find: client.getReaderById,
    update: client.updateReaderById,
    delete: client.deleteReaderById,
    createHoldRequest: client.createReaderHoldRequest,
    cancelHoldRequest: client.cancelReaderHoldRequest,
    getHoldRequests: client.getReaderHoldRequests,
    getBorrowHistory: client.getReaderBorrowHistory,
};

export const PublisherApi = {
    list: client.getPublishers,
    find: client.getPublisherById,
    create: client.createPublisher,
    update: client.updatePublisher,
    delete: client.deletePublisher,
};

export const StaffApi = {
    list: client.getStaffs,
    find: client.getStaffById,
    getProfile: client.getStaffProfile,
    update: client.updateStaff,
    delete: client.deleteStaff,
    create: client.createStaff,
};

export const AuthApi = {
    loginAsReader: client.loginAsReader,
    loginAsStaff: client.loginAsStaff,
    logout: client.logout,
};

export const BorrowApi = {
    list: client.getAllBorrows,
    listHoldRequests: client.getAllHoldRequests,
    acceptBorrowFromHoldRequest: client.acceptBorrowFromHoldRequests,
    borrow: client.borrowBook,
    return: client.returnBook,
};

export default {
    book: BookApi,
    reader: ReaderApi,
    publisher: PublisherApi,
    staff: StaffApi,
    auth: AuthApi,
    borrow: BorrowApi
}