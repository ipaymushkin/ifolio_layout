import styled from "styled-components";

export const SocialWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

export const IconWrapper = styled.div`
  cursor: ${({isEdit}) => (isEdit ? "default" : "pointer")};
  margin: 0 0 10px 10px;
`;

export const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 10px;
  @media screen and (max-width: ${({theme}) => theme.breakpoints.values.md + 1}px) {
    margin-bottom: ${({isEdit}) => (isEdit ? "16px" : null)};
    width: ${({isEdit}) => (isEdit ? "calc(50% - 20px)" : null)};
    flex-grow: 1;
  }
`;
