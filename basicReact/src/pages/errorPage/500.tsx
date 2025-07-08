import { themeVariables } from '@/constants/theme'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

/**
 * template
 */
const StyledNotFoundPage = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #999;
`
const StyledText = styled.p`
  padding: 0 0 40px 0;
  font-size: 160px;
  color: ${themeVariables.colors.primary};
`
const NotFoundPage = () => {
  // 获取导航函数
  const navigate = useNavigate()
  const handleBack = () => {
    navigate({
      pathname: '/'
    })
  }

  return (
    <StyledNotFoundPage className="container">
      <StyledText>500</StyledText>
      <Button type="primary" onClick={handleBack}>
        回到首页
      </Button>
    </StyledNotFoundPage>
  )
}

export default NotFoundPage
