import axiosInstance from './axiosInstance'

export const registerUser = async (signupForm: any) => {
  try {
    const formData = new FormData()
    const memberDTO = {
      email: signupForm.email,
      name: signupForm.name,
      nickname: signupForm.nickname,
      password: signupForm.password,
      birthday: signupForm.birthday,
      sidoName: signupForm.sidoName,
      gugunName: signupForm.gugunName,
      dongName: signupForm.dongName,
    }

    formData.append(
      'memberDTO',
      new Blob([JSON.stringify(memberDTO)], { type: 'application/json' })
    )
    if (signupForm.image) {
      formData.append('image', signupForm.image)
    }

    const response = await axiosInstance.post('members/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error: any) {
    console.error('Error response:', error.response)
    throw new Error('Failed to register')
  }
}
// 사용자 정보를 가져오는 함수
export const fetchUserInfo = async () => {
  try {
    const response = await axiosInstance.get('members/get-member')
    console.log(response.data)
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch user information')
  }
}

// 사용자 정보를 업데이트하는 함수
export const updateUserInfo = async (userInfo: any) => {
  try {
    const memberUpdateRequestDTO = {
      email: userInfo.email,
      name: userInfo.name,
      nickname: userInfo.nickname,
      birthday: userInfo.birthday,
      sidoName: userInfo.sidoName,
      gugunName: userInfo.gugunName,
      dongName: userInfo.dongName,
      image: userInfo.image,
      // 필요한 다른 필드들 추가
    }

    const formData = new FormData()
    formData.append(
      'memberUpdateRequestDTO',
      new Blob([JSON.stringify(memberUpdateRequestDTO)], {
        type: 'application/json',
      })
    )
    if (userInfo.image) {
      formData.append('image', userInfo.image)
    }

    const response = await axiosInstance.put(
      'members/update-member',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    return response.data
  } catch (error: any) {
    console.error('Error response:', error.response)
    throw new Error('Failed to update user info')
  }
}
