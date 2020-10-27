import { httpGETRequest } from "../httpRequestHandler";
import API from "../endpoints";
import {
  setProcessStatusLoading,
  setProcessList,
  setProcessLoadError,
  setAllProcessList,
  setFormProcessesData,
  setFormProcessLoadError,
  setProcessActivityData,
  setProcessDiagramXML,
  setProcessDiagramLoading,
} from "../../actions/processActions";
import { replaceUrl } from "../../helper/helper";
import UserService from "../../services/UserService";

export const getProcessStatusList = (processId, taskId) => {
  return (dispatch) => {
    dispatch(setProcessStatusLoading(true));
    dispatch(setProcessLoadError(false));
    const apiUrlProcessId = replaceUrl(
      API.PROCESS_STATE,
      "<process_key>",
      processId
    );

    const apiURLWithtaskId = replaceUrl(apiUrlProcessId, "<task_key>", taskId);

    httpGETRequest(apiURLWithtaskId)
      .then((res) => {
        if (res.data) {
          dispatch(setProcessStatusLoading(false));
          dispatch(setProcessList(res.data.status));
        } else {
          dispatch(setProcessStatusLoading(false));
          dispatch(setProcessList([]));
          dispatch(setProcessLoadError(true));
        }
      })
      .catch((error) => {
        dispatch(setProcessStatusLoading(false));
        dispatch(setProcessLoadError(true));
      });
  };
};

/**
 *
 * @param  {...any} rest
 */
export const fetchAllBpmProcesses = (...rest) => {
  const done = rest.length ? rest[0] : () => {};
  return (dispatch) => {
    httpGETRequest(API.PROCESSES, {}, UserService.getToken(), true)
      .then((res) => {
        if (res.data) {
          dispatch(setAllProcessList(res.data.process));
          done(null, res.data);
        } else {
          dispatch(setAllProcessList([]));
          dispatch(setProcessLoadError(true));
        }
      })
      .catch((error) => {
        // dispatch(setProcessStatusLoading(false));
        dispatch(setProcessLoadError(true));
      });
  };
};

/**
 *
 * @param  {...any} rest
 */
export const getFormProcesses = (formId, ...rest) => {
  const done = rest.length ? rest[0] : () => {};
  return (dispatch) => {
    httpGETRequest(
      `${API.FORM_PROCESSES}/${formId}`,
      {},
      UserService.getToken(),
      true
    )
      .then((res) => {
        if (res.data) {
          dispatch(setFormProcessesData(res.data)); // need to check api and put exact respose
          done(null, res.data);
        } else {
          dispatch(setFormProcessesData([]));
          dispatch(setProcessLoadError(true));
        }
      })
      .catch((error) => {
        // dispatch(setProcessStatusLoading(false));
        dispatch(setFormProcessLoadError(true));
      });
  };
};

/**
 *
 * @param  {...any} rest
 */
export const getProcessActivities = (process_instance_id, ...rest) => {
  const done = rest.length ? rest[0] : () => {};
  const apiUrlProcessActivities= replaceUrl(
    API.PROCESS_ACTIVITIES,
    "<process_instance_id>",
    process_instance_id
  );
  return (dispatch) => {
    httpGETRequest(
      apiUrlProcessActivities,
      {},
      UserService.getToken(),
      true
    )
      .then((res) => {
        if (res.data) {
          dispatch(setProcessActivityData(res.data.childActivityInstances));
        } else {
          dispatch(setProcessLoadError(true));
        }
        done(null,res.data);
      })
      .catch((error) => {
        done(error);
        dispatch(setProcessLoadError(true));
      });
  };
};

/**
 *
 * @param  {...any} rest
 */
// export const fetchDiagram = (process_key, ...rest) => {
//   console.log('inside fetchDiagram >>',process_key);
//   const url =API.PROCESSES+'/'+process_key+'/xml';
//   const done = rest.length ? rest[0] : () => {};
//   console.log('inside fetchDiagram URL>>',url);
//   return (dispatch) => {
//     httpGETRequest(
//       url,
//       {},
//       UserService.getToken(),
//       true
//     )
//     .then((res) => {
//       if (res.data) {
//         dispatch(setProcessDiagramXML(res.data.bpmn20Xml));
//         console.log('res.data.bpmn20Xml>>',res.data.bpmn20Xml);
//       } else {
//         //TODO
//       }
//       dispatch(setProcessDiagramLoading(false));
//       done(null,res.data);
//     })
//     .catch((error) => {
//         done(error);
//         dispatch(setProcessDiagramLoading(false));
//       });
//   };
// };

export const fetchDiagram = (process_key, ...rest) => {
  console.log('inside fetchDiagram >>',process_key);
  const url =API.PROCESSES+'/'+process_key+'/xml';
  const done = rest.length ? rest[0] : () => {};
  console.log('inside fetchDiagram URL>>',url);
  return (dispatch) => {
    httpGETRequest(
      url,
      {},
      UserService.getToken(),
      true
    )
    .then((res) => {
      if (res.data) {
        dispatch(setProcessDiagramXML(res.data.bpmn20Xml));
        // console.log('res.data.bpmn20Xml>>',res.data.bpmn20Xml);
      } else {
        //TODO
      }
      dispatch(setProcessDiagramLoading(false));
      done(null,res.data);
    })
    .catch((error) => {
        done(error);
        dispatch(setProcessDiagramLoading(false));
      });
  };
};


