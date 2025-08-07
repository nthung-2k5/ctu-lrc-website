import Book from '../app/models/Book.js';
import Reader from '../app/models/Reader.js';
import Staff from '../app/models/Staff.js';
import Publisher from '../app/models/Publisher.js';
import Borrow from '../app/models/Borrow.js';
import connectDB from '../app/config/db.js';

const seedData = async () => {
    try {
        await connectDB();

        console.log('🌱 Starting database seeding...');

        // Clear existing data
        await Promise.all([
            Book.deleteMany(),
            Reader.deleteMany(),
            Staff.deleteMany(),
            Publisher.deleteMany(),
            Borrow.deleteMany()
        ]);

        // Create Publisher
        const maNXB = await Publisher.create({
            tenNXB: 'NXB Giáo dục Việt Nam',
            diaChi: 'Số 81 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội',
            sdt: '02438220801',
            website: 'https://nxbgd.vn/'
        });

        // Create some books
        const books = await Book.create([
            {
                tenSach: 'Lập trình Python căn bản',
                ISBN: '978-604-777-001-1',
                tacGia: 'Nguyễn Văn A',
                donGia: 150000,
                maNXB: maNXB._id,
                namXuatBan: 2023,
                soTrang: 350,
                theLoai: ['Công nghệ thông tin', 'Lập trình'],
                tomTat: 'Giáo trình Python cơ bản'
            },
            {
                tenSach: 'Cấu trúc dữ liệu và giải thuật',
                ISBN: '978-604-777-002-2',
                tacGia: 'Trần Thị B',
                donGia: 200000,
                maNXB: maNXB._id,
                namXuatBan: 2023,
                soTrang: 450,
                theLoai: ['Công nghệ thông tin', 'Khoa học máy tính'],
                tomTat: 'Sách về cấu trúc dữ liệu'
            },
            {
                tenSach: 'Mạng máy tính',
                ISBN: '978-604-777-003-3',
                tacGia: 'Lê Văn C',
                donGia: 180000,
                maNXB: maNXB._id,
                namXuatBan: 2022,
                soTrang: 400,
                theLoai: ['Công nghệ thông tin', 'Mạng'],
                tomTat: 'Giáo trình mạng máy tính'
            }
        ]);

        // Create readers
        const readers = await Reader.create([
            {
                hoLot: 'Nguyễn',
                ten: 'Văn An',
                email: 'nguyenvana@gmail.com',
                matKhau: 'password',
                dienThoai: '0901234567',
                phai: 'M',
                ngaySinh: new Date(2000, 5, 15),
            },
            {
                hoLot: 'Trần',
                ten: 'Thị Bình',
                email: 'tranthib@gmail.com',
                matKhau: 'password',
                dienThoai: '0901234568',
                phai: 'F',
                ngaySinh: new Date(2001, 3, 20),
            }
        ]);

        await Staff.create({
            hoTenNV: 'Admin',
            tenDangNhap: 'admin',
            matKhau: 'password',
            chucVu: 'admin',
        });

        const staff = await Staff.create({
            hoTenNV: 'Staff Member',
            tenDangNhap: 'staff001',
            matKhau: 'password',
            soDienThoai: '0701234567',
            chucVu: 'staff'
        });

        // Create some borrow records
        const borrowRecords: any[] = [];
        const today = new Date();
        // const pastDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

        // Active borrows
        // for (let i = 0; i < 6; i++) {
        //     const copy = books[i % books.length];
        //     if (copy) {
        //         const borrow = await Borrow.create({
        //             maDocGia: readers[i % readers.length]._id,
        //             maSach: copy._id,
        //             ngayMuon: pastDate,
        //             hanTra: new Date(pastDate.getTime() + 14 * 24 * 60 * 60 * 1000),
        //         });

        //         borrowRecords.push(borrow);
        //     }
        // }

        // // Returned borrows
        // for (let i = 0; i < 10; i++) {
        //     const availableCopy = books[(i + 6) % books.length];
        //     if (availableCopy) {
        //         const returnDate = new Date(pastDate.getTime() + Math.random() * 20 * 24 * 60 * 60 * 1000);
        //         const borrow = await Borrow.create({
        //             maDocGia: readers[i % readers.length]._id,
        //             maSach: availableCopy._id,
        //             ngayMuon: pastDate,
        //             hanTra: new Date(pastDate.getTime() + 14 * 24 * 60 * 60 * 1000),
        //             ngayTra: returnDate
        //         });

        //         borrowRecords.push(borrow);
        //     }
        // }

        console.log('✅ Database seeded successfully!');
        console.log(`📚 Created ${books.length} books`);
        console.log(`👥 Created ${readers.length} readers`);
        console.log(`👨‍💼 Created 1 admin and 1 staff member`);
        console.log(`📋 Created ${borrowRecords.length} borrow records`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
