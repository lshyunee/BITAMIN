import { useState, useEffect, ChangeEvent, useRef } from 'react'
import styles from 'styles/account/MyPage.module.css'
import HospitalMap from 'stories/organisms/HospitalMap'
import { fetchUserInfo, updateUserInfo } from '@/api/userAPI'
import { fetchHealthReports } from '@/api/userAPI'
import { useNavigate } from 'react-router-dom'
import HeaderAfterLogin from '@/stories/organisms/common/HeaderAfterLogin'
import Footer from '@/stories/organisms/common/Footer'

const MyPage: React.FC = () => {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState({
    email: '',
    name: '',
    nickname: '',
    birthday: '',
    sidoName: '',
    gugunName: '',
    dongName: '',
    image: null as File | null,
    profileUrl: '',
    checkupScore: 0,
    checkupDate: '',
  })

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [initialProfileUrl, setInitialProfileUrl] = useState<string | null>(
    null
  )

  const [location, setLocation] = useState({
    lat: 0,
    lng: 0,
  })

  const [isEditing, setIsEditing] = useState(false)

  const [healthReports, setHealthReports] = useState<any[]>([])

  const getScoreMessage = (score: number): string => {
    if (score <= 15) {
      return `현재 당신의 점수는 정상 범위에 속합니다. 유의미한 수준의 우울감이 나타나지 않으며, 전반적으로 안정된 상태를 유지하고 있습니다. 이러한 상태를 지속적으로 유지하기 위해 현재의 생활 습관을 잘 관리하시길 권장드립니다. 만약 기분 변화가 느껴지거나 불안함이 생긴다면, 가벼운 산책이나 취미 생활을 통해 긍정적인 기운을 유지하는 것도 도움이 될 수 있습니다.`
    } else if (score <= 20) {
      return `다소 경미한 수준의 우울감이 느껴질 수 있습니다. 이러한 기분은 일상생활에 큰 지장을 주지는 않지만, 지속된다면 심리적, 신체적 자원에 영향을 미칠 가능성이 있습니다. 지금은 충분한 휴식과 자기 돌봄이 중요한 시기입니다. 스스로의 감정에 귀 기울이고, 필요하다면 가까운 친구나 가족과 대화를 나누며 마음을 나누어 보세요. 또한, 이러한 기분이 지속될 경우 가까운 지역센터나 전문기관을 찾아 전문가의 도움을 받는 것도 좋은 방법입니다.`
    } else if (score <= 24) {
      return `현재 당신의 점수는 중간 정도의 우울감을 나타내고 있습니다. 이 정도의 우울감은 종종 일상생활에 어려움을 초래할 수 있으며, 신체적, 심리적 에너지를 저하시킬 가능성이 큽니다. 이러한 상황에서는 혼자 감정을 다루기보다는 전문가의 도움을 받는 것이 좋습니다. 가까운 지역센터나 전문기관에서 상담을 받아보는 것을 적극 권장드립니다. 전문가와 함께라면 당신의 기분 상태를 더 잘 이해하고, 필요한 지원을 받을 수 있을 것입니다.`
    } else {
      return `현재 점수는 심각한 수준의 우울감을 나타내며, 즉각적인 전문적인 지원이 필요할 수 있습니다. 이 정도의 우울감은 일상생활의 기능을 크게 저하시킬 수 있으며, 신체적, 심리적 건강에 심각한 영향을 미칠 수 있습니다. 가능한 빨리 전문기관을 찾아가 치료적 개입과 평가를 받아보시기를 강력히 권장드립니다. 전문가의 도움을 통해, 당신의 현재 상태를 개선할 수 있는 구체적인 방법을 찾을 수 있을 것입니다. 혼자가 아닌, 함께 극복해 나가는 것이 중요합니다.`
    }
  }

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const data = await fetchUserInfo()
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          email: data.email,
          name: data.name,
          nickname: data.nickname,
          birthday: data.birthday,
          sidoName: data.sidoName,
          gugunName: data.gugunName,
          dongName: data.dongName,
          profileUrl: data.profileUrl,
        }))
        setPreviewUrl(data.profileUrl)
        setInitialProfileUrl(data.profileUrl) // 초기 profileUrl 설정

        setLocation({
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lng),
        })
      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    }

    const getHealthReports = async () => {
      try {
        const healthReports = await fetchHealthReports()
        if (healthReports.length > 0) {
          const latestReport = healthReports[healthReports.length - 1]
          setUserInfo((prevUserInfo) => ({
            ...prevUserInfo,
            checkupScore: latestReport.checkupScore,
            checkupDate: latestReport.checkupDate,
          }))
        }
      } catch (error) {
        console.error('Error fetching health reports:', error)
      }
    }

    getUserInfo()
    getHealthReports()
  }, [])

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click() // 이미지 클릭 시 파일 입력 창 열기
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    if (name === 'image' && files && files[0]) {
      const imageFile = files[0]
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        image: imageFile,
      }))
      const previewUrl = URL.createObjectURL(imageFile)
      setPreviewUrl(previewUrl)
    } else {
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        [name]: value,
      }))
    }
  }

  const handleUpdateUserInfo = async () => {
    try {
      // 이미지를 변경하지 않았다면 initialProfileUrl을 사용
      const updatedUserInfo = {
        ...userInfo,
        profileUrl: userInfo.image ? userInfo.profileUrl : userInfo.profileUrl,
      }
      console.log('Updated user info:', updatedUserInfo) // 여기서 profileUrl 값 확인

      await updateUserInfo(updatedUserInfo)
      alert('정보가 성공적으로 수정되었습니다.')
      setIsEditing(false)
      const data = await fetchUserInfo()
      setPreviewUrl(data.profileUrl)
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        profileUrl: data.profileUrl,
        image: null,
      }))
      setInitialProfileUrl(data.profileUrl) // 최신 프로필 URL을 초기값으로 갱신
    } catch (error) {
      console.error('Error updating user info:', error)
      alert('정보 수정에 실패했습니다.')
    }
  }

  const scoreDescription = getScoreMessage(userInfo.checkupScore)

  const handleEditClick = async () => {
    if (isEditing) {
      await handleUpdateUserInfo() // 수정 모드에서 나올 때 정보 업데이트
    }
    setIsEditing(!isEditing)
  }

  return (
    <>
      <HeaderAfterLogin username="{username}" />
      <div className={styles.div}>
        <div className={styles.InfoBox}>
          <div className={styles.child}>
            <div className={styles.item} onClick={handleImageClick}>
              {previewUrl ? (
                <img src={previewUrl} alt="미리보기 이미지" />
              ) : (
                <div className={styles.placeholder}>이미지를 첨부하세요</div>
              )}
            </div>
            <input
              type="file"
              name="image"
              accept=".jpg,.jpeg,.png"
              ref={fileInputRef}
              onChange={handleInputChange}
              style={{ display: 'none' }}
            />
          </div>
          <div className={styles.frameParent}>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="name"
                  value={userInfo.name}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="nickname"
                  value={userInfo.nickname}
                  onChange={handleInputChange}
                />
                <input
                  type="date"
                  name="birthday"
                  value={userInfo.birthday}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="sidoName"
                  value={userInfo.sidoName}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="gugunName"
                  value={userInfo.gugunName}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="dongName"
                  value={userInfo.dongName}
                  onChange={handleInputChange}
                />
              </div>
            ) : (
              <div>
                <div className={styles.categoryContainer}>
                  <div className={styles.categoryTitle}>Email</div>
                  <div className={styles.categoryContent}>{userInfo.email}</div>
                </div>
                <div className={styles.categoryContainer}>
                  <div className={styles.categoryTitle}>Name</div>
                  <div className={styles.categoryContent}>{userInfo.name}</div>
                </div>
                <div className={styles.categoryContainer}>
                  <div className={styles.categoryTitle}>Nickname</div>
                  <div className={styles.categoryContent}>
                    {userInfo.nickname}
                  </div>
                </div>
                <div className={styles.categoryContainer}>
                  <div className={styles.categoryTitle}>Birthday</div>
                  <div className={styles.categoryContent}>
                    {userInfo.birthday}
                  </div>
                </div>
                <div className={styles.categoryContainer}>
                  <div className={styles.categoryTitle}>Address</div>
                  <div className={styles.categoryContent}>
                    {userInfo.sidoName} {userInfo.gugunName} {userInfo.dongName}
                  </div>
                </div>
              </div>
            )}

            <div className={styles.buttonContainer}>
              <div
                className={`${styles.container} ${styles.buttonStyle}`}
                onClick={handleEditClick}
              >
                <div>{isEditing ? '저장' : '정보 수정'}</div>
              </div>
              <div
                className={`${styles.container} ${styles.buttonStyle}`}
                onClick={() => navigate('/change-password')}
              >
                <div className={styles.div6}>비밀번호 변경</div>
              </div>
            </div>
          </div>
          <div className={styles.inner} />
          <div className={styles.div4}>마이페이지</div>
        </div>
        <div className={styles.rectangleDiv}>
          <div className={styles.resultContainer}>
            <div className={styles.div10}>검사 결과</div>
            <div className={styles.div8}>{userInfo.checkupDate}의 점수</div>
            <div className={styles.div11}>
              <span className={styles.span}>{userInfo.checkupScore}</span>
              <span className={styles.span1}>점</span>
            </div>
            <div className={styles.div12}>
              검사 소견
              <br />
              {scoreDescription}
            </div>
          </div>
        </div>

        <div className={styles.div9}>내 주변 병원 찾기</div>
        <div className={styles.child1} />
        <script
          type="text/javascript"
          src="//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_APP_KAKAOMAP_KEY}&libraries=services"
        ></script>
        <div className={styles.div66}>
          <b>{userInfo.sidoName} </b>
          <b>{userInfo.gugunName}</b>
          <div className={styles.inner} />
          <span className={styles.span4}>
            <span>에 있는</span>
            <span className={styles.span5}>{` `}</span>
          </span>
          <b>정신건강의학과</b>
        </div>
        <div className={styles.mapWrapper}>
          <HospitalMap lat={location.lat} lng={location.lng} />
        </div>
        <div className={styles.groupParent}>
          <div className={styles.chartParent}>
            <div className={styles.chart}>
              <img className={styles.groupIcon} alt="" src="Group.svg" />
              <div className={styles.group1}>
                <img className={styles.vectorIcon1} alt="" src="Vector.svg" />
                <div className={styles.group2}>
                  <div className={styles.group3}>
                    <img
                      className={styles.vectorIcon2}
                      alt=""
                      src="Vector.svg"
                    />
                    <div className={styles.div49}>0</div>
                  </div>
                  <div className={styles.group4}>
                    <img
                      className={styles.vectorIcon3}
                      alt=""
                      src="Vector.svg"
                    />
                    <div className={styles.div50}>15</div>
                  </div>
                  <div className={styles.group5}>
                    <img
                      className={styles.vectorIcon4}
                      alt=""
                      src="Vector.svg"
                    />
                    <div className={styles.div51}>30</div>
                  </div>
                  <div className={styles.group6}>
                    <img
                      className={styles.vectorIcon5}
                      alt=""
                      src="Vector.svg"
                    />
                    <div className={styles.div52}>45</div>
                  </div>
                  <div className={styles.group7}>
                    <img
                      className={styles.vectorIcon6}
                      alt=""
                      src="Vector.svg"
                    />
                    <div className={styles.div52}>60</div>
                  </div>
                </div>
              </div>
              <img className={styles.groupIcon1} alt="" src="Group.svg" />
              <img className={styles.groupIcon2} alt="" src="Group.svg" />
              <div className={styles.group8}>
                <img className={styles.vectorIcon7} alt="" src="Vector.svg" />
                <div className={styles.div54}>10</div>
              </div>
            </div>
          </div>
          <div className={styles.group9}>
            <img className={styles.vectorIcon8} alt="" src="Vector.svg" />
            <div className={styles.div57}>1</div>
          </div>
          <div className={styles.group10}>
            <img className={styles.vectorIcon9} alt="" src="Vector.svg" />
            <div className={styles.div57}>2</div>
          </div>
          <div className={styles.group11}>
            <img className={styles.vectorIcon9} alt="" src="Vector.svg" />
            <div className={styles.div57}>3</div>
          </div>
          <div className={styles.group12}>
            <img className={styles.vectorIcon9} alt="" src="Vector.svg" />
            <div className={styles.div57}>4</div>
          </div>
          <div className={styles.group13}>
            <img className={styles.vectorIcon9} alt="" src="Vector.svg" />
            <div className={styles.div57}>5</div>
          </div>
          <div className={styles.group14}>
            <img className={styles.vectorIcon9} alt="" src="Vector.svg" />
            <div className={styles.div57}>6</div>
          </div>
          <div className={styles.group15}>
            <img className={styles.vectorIcon14} alt="" src="Vector.svg" />
            <div className={styles.div57}>7</div>
          </div>
          <div className={styles.group16}>
            <img className={styles.vectorIcon9} alt="" src="Vector.svg" />
            <div className={styles.div57}>8</div>
          </div>
          <div className={styles.group17}>
            <img className={styles.vectorIcon9} alt="" src="Vector.svg" />
            <div className={styles.div57}>9</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MyPage
