import { useEffect, useState } from 'react'
import { getPhrases } from '@/api/phraseAPI'
import styles from 'styles/account/ExLogin.module.css'
import mainImg from 'assets/image/mainImg.png'
import loginexGgul from 'assets/image/loginexGgul.png'

const ExLogin: React.FC = () => {
  const [phraseContent, setPhraseContent] = useState('') // phraseContent 상태 추가

  useEffect(() => {
    const fetchPhrase = async () => {
      try {
        const data = await getPhrases()
        setPhraseContent(data.phrase)
      } catch (error) {
        console.error('Error fetching the phrase:', error)
      }
    }

    fetchPhrase()
  }, []) // 컴포넌트가 마운트될 때 한번만 호출

  return (
    <div>
      <div className={styles.innerSection}>
        <div className={styles.inner}>
          <div className={styles.div3}>
            <p className={styles.p}>{phraseContent}</p>
          </div>
        </div>
      </div>

      <div className={styles.suggestionSection}>
        <p className={styles.suggestionText}>
          비타민이 제안하는 마음 관리 솔루션
        </p>
        <p className={styles.underlineText}>
          시작부터 관리까지 <span>비타민과 함께</span> 하세요.
        </p>
        <p className={styles.taglineText}>better tomorrow, better mind</p>
        <p className={styles.subtext}>
          더 나은 내가 되자는 의미를 담아 마음을 관리하며 서로 소통하는
          페이지입니다.
        </p>
      </div>
      <img className={styles.loginexGgul} src={loginexGgul} alt="" />
      <img className={styles.mainImg} alt="Main Image" src={mainImg} />

      <button onClick={() => (window.location.href = '/login')}>
        지금 이용하러 가기
      </button>
    </div>
  )
}

export default ExLogin
