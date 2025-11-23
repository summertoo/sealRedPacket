import { useState, useCallback, useEffect } from 'react';
import { useSuiClient } from '@mysten/dapp-kit';
import { SealService } from '../services/sealService';

export const useSealEncryption = (roomId: string) => {
  const suiClient = useSuiClient();
  const [sealService] = useState(() => new SealService(suiClient));
  const [sessionKey, setSessionKey] = useState<string | null>(null);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初始化会话密钥
  const initializeSession = useCallback(async () => {
    try {
      setError(null);
      const key = await sealService.generateSessionKey(roomId);
      setSessionKey(key);
      return key;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize session';
      setError(errorMessage);
      throw err;
    }
  }, [roomId, sealService]);

  // 加密选择
  const encryptChoice = useCallback(async (choice: 'A' | 'B') => {
    if (!sessionKey) {
      throw new Error('Session key not initialized');
    }

    setIsEncrypting(true);
    setError(null);
    
    try {
      const encrypted = await sealService.encryptChoice(choice, roomId, sessionKey);
      return encrypted;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Encryption failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsEncrypting(false);
    }
  }, [roomId, sessionKey, sealService]);

  // 解密选择
  const decryptChoice = useCallback(async (encrypted: string) => {
    if (!sessionKey) {
      throw new Error('Session key not initialized');
    }

    setIsDecrypting(true);
    setError(null);
    
    try {
      const choice = await sealService.decryptChoice(encrypted, sessionKey);
      return choice;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Decryption failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsDecrypting(false);
    }
  }, [sessionKey, sealService]);

  // 批量解密
  const decryptAllChoices = useCallback(async (encryptedChoices: string[]) => {
    if (!sessionKey) {
      throw new Error('Session key not initialized');
    }

    setIsDecrypting(true);
    setError(null);
    
    try {
      const results = await sealService.decryptAllChoices(encryptedChoices, sessionKey);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Batch decryption failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsDecrypting(false);
    }
  }, [sessionKey, sealService]);

  // 验证加密数据
  const validateEncryptedData = useCallback(async (encryptedData: string) => {
    try {
      setError(null);
      const isValid = await sealService.validateEncryptedData(encryptedData, roomId);
      return isValid;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Validation failed';
      setError(errorMessage);
      return false;
    }
  }, [roomId, sealService]);

  // 获取加密数据信息
  const getEncryptedDataInfo = useCallback((encryptedData: string) => {
    return sealService.getEncryptedDataInfo(encryptedData);
  }, [sealService]);

  // 清除错误
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 重置会话
  const resetSession = useCallback(() => {
    setSessionKey(null);
    setError(null);
    setIsEncrypting(false);
    setIsDecrypting(false);
  }, []);

  // 自动初始化会话
  useEffect(() => {
    if (roomId && !sessionKey) {
      initializeSession().catch(console.error);
    }
  }, [roomId, sessionKey, initializeSession]);

  return {
    sessionKey,
    isEncrypting,
    isDecrypting,
    error,
    initializeSession,
    encryptChoice,
    decryptChoice,
    decryptAllChoices,
    validateEncryptedData,
    getEncryptedDataInfo,
    clearError,
    resetSession,
  };
};
