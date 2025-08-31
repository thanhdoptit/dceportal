import React from 'react';
import { Result, Button } from 'antd';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="Đã xảy ra lỗi"
          subTitle={this.state.error?.message || 'Vui lòng thử lại sau'}
          extra={[
            <Button type="primary" key="reload" onClick={() => window.location.reload()}>
              Tải lại trang
            </Button>,
            <Button key="back" onClick={() => window.history.back()}>
              Quay lại
            </Button>
          ]}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 