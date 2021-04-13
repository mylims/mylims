import React from 'react';

import { ErrorPage } from './ErrorPage';
import { ErrorReport } from './ErrorReport';

interface ErrorState {
  error: Error | null;
  componentStack: string | null;
}

export class PageErrorBoundary extends React.Component<unknown, ErrorState> {
  public constructor(props: unknown) {
    super(props);
    this.state = { error: null, componentStack: null };
  }

  public componentDidCatch(
    error: Error,
    componentStack: { componentStack: string },
  ) {
    this.setState({
      error,
      componentStack: componentStack.componentStack,
    });
  }

  public render() {
    const { error, componentStack } = this.state;
    if (error) {
      return (
        <ErrorPage title="Oooops" subtitle="Something unexpectedly went wrong">
          <div className="mr-8">
            <ErrorReport error={error} componentStack={componentStack} />
          </div>
        </ErrorPage>
      );
    }

    return this.props.children;
  }
}
