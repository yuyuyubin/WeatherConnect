'use client';

import { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface SiteUsageDashboardProps {
  onClose: () => void;
}

export const SiteUsageDashboard: React.FC<SiteUsageDashboardProps> = ({ onClose }) => {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleBackgroundClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackgroundClick}
    >
      <Card className="w-full max-w-2xl p-8 relative"> {/* Increased box size */}
        <Button
          onClick={handleClose}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
        >
          <X className="h-8 w-8" /> {/* Enlarged close button */}
        </Button>
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">사용법</CardTitle> {/* Increased title size */}
        </CardHeader>
        <CardContent className="text-2xl space-y-6"> {/* Increased font size for instructions */}
          <p>
            1.첫 박스에는 오늘 날씨가 표시되며 현재 시간의 기온이 표시됩니다.
          </p>
          <p>
            2. 날씨 예보를 보려면 날짜를 선택하세요.
            시간별로 그래프가 그려지며 원하는 지표만 고를 수 있습니다.
          </p>
          <p>
            3. 다양한 기상 예보 서비스를 비교하려면 "날씨 비교" 버튼을 클릭하세요.
            일자별, 시간별로 비교가 가능합니다.
          </p>
          <p>
            4. 오보율을 확인하려면 "오보율 계산" 버튼을 클릭하세요.
            달력에서 날짜를 선택하여 구간을 지정할 수 있습니다.
          </p>
          <p>
            5. N/A 값은 날씨 예보 제공처에서 제공하지 않는 정보입니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
