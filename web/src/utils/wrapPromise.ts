interface IResource {
  read: () => Response;
}

function wrapPromise(promise: Promise<any>): IResource {
  let status = 'pending';
  let response: Response;

  const suspender = promise.then(
    (res) => {
      status = 'success';
      response = res;
    },
    (err) => {
      status = 'error';
      response = err;
    }
  );
  const read = () => {
    switch (status) {
      case 'pending':
        throw suspender;
      case 'error':
        throw response;
      default:
        return response;
    }
  };

  return { read };
}

export default wrapPromise;
export type { IResource };
