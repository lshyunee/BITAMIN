import { FunctionComponent } from 'react'

const Footer: FunctionComponent = () => {
  return (
    <div className="w-full relative bg-gray-100 h-[9.813rem] flex flex-col items-start justify-start py-[1.75rem] px-[8.75rem] box-border text-left text-[0.875rem] text-gray-200 font-bagel-fat-one">
      <div className="w-[46.5rem] flex flex-col items-center justify-start gap-[0.375rem]">
        <img
          className="w-[46.5rem] relative max-h-full"
          alt=""
          src="Vector 50.svg"
        />
        <div className="w-[45.563rem] flex flex-row items-start justify-between">
          <div className="w-[21.688rem] flex flex-col items-start justify-start gap-[0.562rem]">
            <div className="w-[12.375rem] flex flex-col items-start justify-start gap-[0.187rem]">
              <div className="self-stretch relative">BItAMin</div>
              <div className="self-stretch flex flex-row items-center justify-start gap-[0.437rem] text-[0.625rem] text-gray-300 font-nanumsquare">
                <div className="relative">이용약관</div>
                <div className="relative text-[0.75rem]">ㅣ</div>
                <div className="relative">개인정보처리방침</div>
                <div className="relative text-[0.75rem]">ㅣ</div>
                <div className="relative">사이트맵</div>
              </div>
            </div>
            <div className="self-stretch relative text-[0.625rem] font-nanumsquare text-gray-300">
              <p className="[margin-block-start:0] [margin-block-end:2px]">
                고객센터 042-123-1234 (평일 상담시간 09:00 ~ 17:00)
              </p>
              <p className="[margin-block-start:0] [margin-block-end:2px]">
                본 사이트의 콘텐츠는 저작권법의 보호를 받는 바 무단 전재, 복사,
                배포 등을 금합니다.
              </p>
              <p className="m-0">© 2024. BItAMin All Rights Reserved.</p>
            </div>
          </div>
          <div className="flex flex-row items-center justify-start gap-[0.187rem]">
            <img
              className="w-[1.438rem] relative h-[1.313rem] object-cover"
              alt=""
              src="Facebook.png"
            />
            <img
              className="w-[1.438rem] relative h-[1.313rem] object-cover"
              alt=""
              src="Instagram.png"
            />
            <img
              className="w-[1.313rem] relative h-[1.313rem] object-cover"
              alt=""
              src="YouTube.png"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
