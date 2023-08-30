import type { ChangeEvent, FC } from 'react';
import { useState } from 'react';
import { WritePre } from '../Presentational/WritePre';
import { isNFCSupported } from '../../../../application/lib/IsNFCSupported';
import { useBoolean } from '@chakra-ui/react';

export const WriteCon: FC = () => {
  const [isSupported,] = useState<boolean>(isNFCSupported());
  const [data, setData] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [writeData, setWriteData] = useState<NDEFRecordInit[]>([]);
  const [isWriting, setIsWriting] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isWritingModal, { on: WritingModalOpen, off: WritingModalClose }] = useBoolean();
  const [isAddModalOpen, { on: AddModalOnOpen, off: AddModalOnClose }] = useBoolean();
  const [recordType, setRecordType] = useState<string>('text');

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setData(e.currentTarget.value);
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.currentTarget.value);
  };

  const handleAddRecord = () => {
    if (recordType === 'text' && data === '') return;
    if (recordType === 'url' && url === '') return;
    setWriteData(prev => [...prev, (() => {
      if (recordType === 'text') {
        return { recordType: 'text', data: data };
      } else {
        return { recordType: 'url', data:  url };
      }
    })()]);
    setData('');
    AddModalOnClose();
  };

  const handleToWrite = async () => {
    if (writeData.length === 0) return;
    try {
      setIsWriting(true);
      setIsError(false);
      WritingModalOpen();
      const writer = new NDEFReader();
      await writer.write({ records: writeData });
    } catch (error) {
      console.log(error);
      setIsError(true);
    } finally {
      setIsWriting(false);
    }
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRecordType(e.currentTarget.value);
  };

  return <WritePre
    writeData={writeData}
    isError={isError}
    isSupported={isSupported}
    isWritingModal={isWritingModal}
    isAddModalOpen={isAddModalOpen}
    data={data}
    url={url}
    isWriting={isWriting}
    recordType={recordType}
    handleAddRecord={handleAddRecord}
    handleTextChange={handleTextChange}
    handleUrlChange={handleUrlChange}
    handleToWrite={handleToWrite}
    WritingModalClose={WritingModalClose}
    AddModalOnOpen={AddModalOnOpen}
    AddModalOnClose={AddModalOnClose}
    handleSelectChange={handleSelectChange}
  />;
};