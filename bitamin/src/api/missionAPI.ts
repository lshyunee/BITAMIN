import axiosInstance from './axiosInstance'

const BASE_URL = 'https://i11b105.p.ssafy.io/api'

// 미션 불러오기
export const getMission = async (token: string) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/missions`)
        return response.data;
    } catch (error) {
        console.error('Error fetching mission:', error);
        throw error;
    }
}

// 미션 교체하기
export const substituteMission = async (missionId: number) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/missions/substitute`, {
            params: { missionId }
        });
        return response.data;
    } catch (error) {
        console.error('Error substituting mission:', error);
        throw error;
    }
};