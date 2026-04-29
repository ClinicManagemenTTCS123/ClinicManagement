import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, FileText, Stethoscope, Pill, ClipboardList, Activity } from 'lucide-react';
import medicalRecordService from '../../services/medicalRecordService';

const MedicalRecordCard = ({ record }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
      {/* Header Card - Luôn hiển thị */}
      <div
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-50 rounded-xl">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{record.diagnosis || "Chưa có chẩn đoán"}</h3>
            <p className="text-sm text-gray-500">
              BS. {record.doctorName} • <span className="font-medium text-blue-500">{record.departmentName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-700">
              {new Date(record.createdAt).toLocaleDateString('vi-VN')}
            </p>
            <p className="text-xs text-gray-400">Ngày khám</p>
          </div>
          {isOpen ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
        </div>
      </div>

      {/* Chi tiết - Hiển thị khi Expand */}
      {isOpen && (
        <div className="px-5 pb-6 border-t border-gray-50 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">

            {/* Cột trái: Thông tin khám bệnh */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 text-blue-600 mb-2">
                  <Stethoscope size={18} />
                  <span className="font-bold text-sm uppercase tracking-wider">Triệu chứng</span>
                </div>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                  "{record.symptoms}"
                </p>
              </div>

              <div>
                <div className="flex items-center space-x-2 text-purple-600 mb-2">
                  <Activity size={18} />
                  <span className="font-bold text-sm uppercase tracking-wider">Chi tiết răng & Chỉ định</span>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 space-y-2">
                  <p className="text-sm"><span className="font-semibold">Vị trí răng:</span> {record.toothDetails || "N/A"}</p>
                  <p className="text-sm"><span className="font-semibold">Chỉ định:</span> {record.indications || "N/A"}</p>
                  <p className="text-sm text-purple-700 font-medium italic italic">Dịch vụ: {record.services || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Cột phải: Đơn thuốc & Ghi chú */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 text-green-600 mb-2">
                  <Pill size={18} />
                  <span className="font-bold text-sm uppercase tracking-wider">Đơn thuốc</span>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {record.prescription || "Không có đơn thuốc"}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2 text-orange-600 mb-2">
                  <ClipboardList size={18} />
                  <span className="font-bold text-sm uppercase tracking-wider">Lời khuyên bác sĩ</span>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                  <p className="text-gray-700 text-sm italic">
                    {record.notes || "Không có ghi chú thêm"}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
const MedicalRecordList = () => {
  // 1. Lấy ID trực tiếp từ localStorage
  const patientId = localStorage.getItem("patientId") || "1";

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      // 2. Kiểm tra kỹ trước khi gọi
      if (!patientId || patientId === "undefined") {
        console.error("Không tìm thấy Patient ID trong localStorage");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Gọi đến service đã khớp với Backend
        const data = await medicalRecordService.getRecordsByPatient(patientId);
        setRecords(data);
      } catch (error) {
        console.error("Lỗi khi tải hồ sơ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [patientId]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Hồ sơ bệnh án</h1>
        <p className="text-gray-500 text-sm">Lịch sử khám bệnh và các dịch vụ nha khoa của bạn</p>
      </div>

      {records.length > 0 ? (
        records.map(record => <MedicalRecordCard key={record.id} record={record} />)
      ) : (
        <div className="bg-gray-50 p-10 rounded-2xl text-center text-gray-400 border-2 border-dashed">
          Bạn chưa có lịch sử hồ sơ bệnh án nào.
        </div>
      )}
    </div>
  );
};

export default MedicalRecordList;