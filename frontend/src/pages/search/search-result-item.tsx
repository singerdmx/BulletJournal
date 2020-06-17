import React from "react";
import {SearchResultItem} from "../../features/search/interface";
import {Card} from "antd";
import {ContentType} from "../../features/myBuJo/constants";
import {AccountBookOutlined, CarryOutOutlined, FileTextOutlined} from '@ant-design/icons';

const {Meta} = Card;

type SearchResultItemProps = {
    item: SearchResultItem;
}

export const contentTypeIconMapper: { [key in ContentType]: React.ReactNode } = {
    [ContentType.TASK]: <CarryOutOutlined/>,
    [ContentType.TRANSACTION]: <AccountBookOutlined/>,
    [ContentType.NOTE]: <FileTextOutlined/>,
    [ContentType.PROJECT]: <FileTextOutlined/>,
    [ContentType.GROUP]: <FileTextOutlined/>,
    [ContentType.LABEL]: <FileTextOutlined/>,
    [ContentType.CONTENT]: <FileTextOutlined/>,
};

const SearchResultItemElement: React.FC<SearchResultItemProps> =
    ({
         item
     }) => {
        const getDescription = (item: SearchResultItem) => {
            return item.nameHighlights.concat(item.contentHighlights).map((highlight) => {
                return <div>{highlight}</div>;
            });
        };

        return <div>
            <Card>
                <Meta title={item.name}
                      avatar={contentTypeIconMapper[item.type]}
                      description={getDescription(item)}/>
            </Card>
        </div>
    };

export default SearchResultItemElement;