import { useEffect, useState } from 'react'
import { getPhrases } from '@/api/phraseAPI'
import styles from 'styles/main/MainPage.module.css'
import mainImg from 'assets/image/mainImg.png'

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
        <img className={styles.mainImg} alt="Main Image" src={mainImg} />
        <div className={styles.inner}>
          <div className={styles.div3}>
            <p className={styles.p}>{phraseContent}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExLogin
