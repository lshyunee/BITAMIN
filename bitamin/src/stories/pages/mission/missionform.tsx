import React, { useEffect, useState } from 'react';
import { getMission, substituteMission } from '@/api/missionAPI';

interface MissionData {
    id: number;
    missionName: string;
    missionDescription: string;
    missionLevel: number;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

const missionform: React.FC = () => {
    const [mission, setMission] = useState<MissionData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchMission();
    }, []);

    const fetchMission = async () => {
        try {
            setLoading(true);
            const token = 'your-jwt-token-here'; // 실제 JWT 토큰을 넣으세요.
            const response: ApiResponse<MissionData> = await getMission(token);
            if (response.success) {
                setMission(response.data);
            } else {
                setError(response.message);
            }
        } catch (error) {
            setError('미션을 가져오는 도중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubstituteMission = async () => {
        if (!mission) return;

        try {
            setLoading(true);
            const response: ApiResponse<MissionData> = await substituteMission(mission.id);
            if (response.success) {
                setMission(response.data);
            } else {
                setError(response.message);
            }
        } catch (error) {
            setError('미션을 교체하는 도중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {mission ? (
                <div>
                    <h1>{mission.missionName}</h1>
                    <p>{mission.missionDescription}</p>
                    <p>Level: {mission.missionLevel}</p>
                    <button onClick={handleSubstituteMission}>미션 교체하기</button>
                </div>
            ) : (
                <p>미션이 없습니다.</p>
            )}
        </div>
    );
}

export default missionform;
